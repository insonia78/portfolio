import "@babel/polyfill";
import dotenv from "dotenv";
import "isomorphic-fetch";
import createShopifyAuth, { verifyRequest } from "@shopify/koa-shopify-auth";
import graphQLProxy, { ApiVersion } from "@shopify/koa-shopify-graphql-proxy";
import { receiveWebhook } from "@shopify/koa-shopify-webhooks";
import Koa from "koa";
import next from "next";
import Router from "koa-router";
import session from "koa-session";
import * as handlers from "./handlers/index";
dotenv.config();
const port = parseInt(process.env.PORT, 10) || 8081;
const dev = process.env.NODE_ENV !== "production";
const app = next({
  dev,
});
const handle = app.getRequestHandler();
const cron = require("node-cron");
const router = new Router();
import { Sequelize } from "sequelize";

const {
  SHOPIFY_API_SECRET,
  SHOPIFY_API_KEY,
  SCOPES,
  DATABASE_URL,
} = process.env;

const sequelize = new Sequelize(DATABASE_URL);

sequelize.authenticate().then(
  () => {
    console.log("Connection has been established successfully.");
  },
  (error) => {
    console.error("Unable to connect to the database:", error);
  }
);

// const db = require('./models');
// db.sequelize.sync();
var pg = require("knex")({
  client: "pg",
  connection: DATABASE_URL,
  searchPath: ["knex", "public"],
});

const dbUtils = new handlers.dbUtils(pg, sequelize);

//-----------------custom routes---------------
require("./routes/main")(router, dbUtils);
require("./routes/dashboardData")(router, dbUtils);
require("./routes/dataSettings")(router, dbUtils);
require("./routes/customSpends")(router, dbUtils);
require("./routes/integrations")(router, dbUtils);

const webhook = receiveWebhook({ secret: SHOPIFY_API_SECRET });
require("./routes/webhooks")(router, dbUtils, webhook);

//------------------------cron jobs-------------------
require("../cron/jobsHandler")(cron, pg, sequelize);

let saveStore = function (shopUrl, key) {
  pg.raw(
    "INSERT INTO stores (url, key) VALUES (?, ?) ON CONFLICT (url) DO UPDATE SET key=?, processed=?",
    [shopUrl, key, key, "1"]
  ).then(
    function () {
      console.log("Store saved successfully");
    },
    function (err) {
      console.log("Error inserting store");
      console.log(err);
    }
  );
};

app.prepare().then(() => {
  const server = new Koa();
  server.use(
    session(
      {
        sameSite: "none",
        secure: true,
      },
      server
    )
  );
  server.keys = [SHOPIFY_API_SECRET];
  server.use(
    createShopifyAuth({
      apiKey: SHOPIFY_API_KEY,
      secret: SHOPIFY_API_SECRET,
      scopes: [SCOPES],

      async afterAuth(ctx) {
        //Auth token and shop available in session
        //Redirect to shop upon auth
        const { shop, accessToken } = ctx.session;
        ctx.cookies.set("shopOrigin", shop, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        ctx.cookies.set("accessToken", accessToken, {
          httpOnly: false,
          secure: true,
          sameSite: "none",
        });
        saveStore(shop, accessToken);

        //-------------------webhooks------------------
        await handlers.registerWebhooks(
          shop,
          accessToken,
          "PRODUCTS_CREATE",
          "/webhooks/products/create",
          ApiVersion.April20
        );

        await handlers.registerWebhooks(
          shop,
          accessToken,
          "PRODUCTS_UPDATE",
          "/webhooks/products/update",
          ApiVersion.April20
        );

        await handlers.registerWebhooks(
          shop,
          accessToken,
          "ORDERS_CREATE",
          "/webhooks/orders/create",
          ApiVersion.April20
        );

        await handlers.registerWebhooks(
          shop,
          accessToken,
          "ORDERS_UPDATED",
          "/webhooks/orders/update",
          ApiVersion.April20
        );

        await handlers.registerWebhooks(
          shop,
          accessToken,
          "CUSTOMERS_CREATE",
          "/webhooks/customers/create",
          ApiVersion.April20
        );

        await handlers.registerWebhooks(
          shop,
          accessToken,
          "CUSTOMERS_UPDATE",
          "/webhooks/customers/update",
          ApiVersion.April20
        );

        server.context.client = await handlers.createClient(shop, accessToken);

        await handlers.getSubscriptionUrl(ctx, shop, accessToken);
      },
    })
  );
  server.use(
    graphQLProxy({
      version: ApiVersion.October19,
    })
  );
  router.get("*", verifyRequest(), async (ctx) => {
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
    ctx.res.statusCode = 200;
  });
  server.use(router.allowedMethods());
  server.use(router.routes());
  server.listen(port, () => {
    console.log(`>c Ready on http://localhost:${port}`);
  });
});
