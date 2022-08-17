import dotenv from "dotenv";
import { google } from "googleapis";

dotenv.config();

const {
  FACEBOOK_SECRET,
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  GOOGLE_CLIENT_SECRET,
} = process.env;

module.exports = function (router, dbUtils) {
  router.get("/api/v1/save-integration/:type", async (ctx) => {
    try {
      let result = 0;
      switch (ctx.params.type) {
        case "facebook":
          let graph = require("fbgraph");
          let result = graph.extendAccessToken(
            {
              access_token: ctx.query.key,
              client_id: FACEBOOK_APP_ID,
              client_secret: FACEBOOK_SECRET,
            },
            async (err, facebookRes) => {
              return await dbUtils.updateStore(ctx.cookies.get("shopOrigin"), {
                facebook_key: facebookRes.access_token,
              });
            }
          );

          break;
        case "google":
          const oAuth2Client = new google.auth.OAuth2(
            GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET,
            GOOGLE_REDIRECT_URI
          );

          let code = ctx.query.code;
          const data = await oAuth2Client.getToken(code);
          if (data.tokens.refresh_token) {
            oAuth2Client.setCredentials(data.tokens);
            await dbUtils.updateStore(ctx.cookies.get("shopOrigin"), {
              google_key: data.tokens,
            });
          }
      }

      ctx.body = {
        status: "success",
        data: result,
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: "failed",
        data: [],
      };
    }
  });

  router.get("/api/v1/integration-status", async (ctx) => {
    try {
      let result = false;
      switch (ctx.query.type) {
        case "facebook":
          result = dbUtils.getIntegrationStatus(
            ctx.cookies.get("shopOrigin"),
            "facebook"
          );

          break;
        case "google":
          result = dbUtils.getIntegrationStatus(
            ctx.cookies.get("shopOrigin"),
            "google"
          );
      }

      ctx.body = {
        status: "success",
        data: result,
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: "failed",
        data: [],
      };
    }
  });
};
