import FacebookSpend from "../../server/models/facebook_spends";
import GoogleSpend from "../../server/models/google_spends";

import dotenv from "dotenv";
import { google } from "googleapis";
import { GoogleAdsApi } from "google-ads-api";
import Moment from "moment";
const graph = require("fbgraph");

graph.setVersion("8.0");
dotenv.config();

const {
  FACEBOOK_SECRET,
  FACEBOOK_APP_ID,
  GOOGLE_CLIENT_ID,
  GOOGLE_REDIRECT_URI,
  GOOGLE_CLIENT_SECRET,
  GOOGLE_DEVELOPER_TOKEN,
} = process.env;

module.exports = {
  processFacebook: async function (shopData, pg, sequelize) {
    if (!shopData.facebook_key) {
      return false;
    }

    graph.extendAccessToken(
      {
        access_token: shopData.facebook_key,
        client_id: FACEBOOK_APP_ID,
        client_secret: FACEBOOK_SECRET,
      },
      async (err, facebookRes) => {
        if (facebookRes.error !== undefined) {
          await pg("stores")
            .update({ facebook_key: "" })
            .where({ url: shopData.url });
        } else {
          await pg("stores")
            .update({ facebook_key: facebookRes.access_token })
            .where({ url: shopData.url });
          graph.setAccessToken(facebookRes.access_token);
          await graph.get("/me/adaccounts", async (err, res) => {
            if (res.data === undefined || res.data.length === 0) {
              return false;
            }

            let count = await FacebookSpend(sequelize).count({
              where: { store_id: shopData.id },
            });
            let daysCount = 1;

            if (count === 0) {
              daysCount = 60;
            }

            let today = Moment();
            let yesterday = Moment();
            yesterday.subtract(daysCount, "days");

            let accountId = res.data[0].id;
            let timeRange = {
              since: yesterday.format("YYYY-MM-DD"),
              until: today.format("YYYY-MM-DD"),
            };

            graph.get(
              "/" +
                accountId +
                "/insights?fields=campaign_name,campaign_id,spend,ad_id,adset_id,ad_name&level=campaign&time_increment=1&time_range=" +
                JSON.stringify(timeRange),
              (err, result) => {
                console.log("result");
                console.log(result);

                for (let i = 0; i < result.data.length; i++) {
                  let dateStart = result.data[i].date_start
                    .toString()
                    .substring(0, 10);
                  let dateStop = result.data[i].date_stop
                    .toString()
                    .substring(0, 10);

                  FacebookSpend(sequelize).upsert({
                    account_id: accountId,
                    spend: result.data[i].spend,
                    date_start: dateStart,
                    date_stop: dateStop,
                    store_id: shopData.id,
                    campaign_id: result.data[i].campaign_id,
                    campaign_name: result.data[i].campaign_name,
                  });
                }
              }
            );
          });
        }
      }
    );
  },

  processGoogle: async function (shopData, pg, sequelize) {
    const oAuth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    oAuth2Client.on("tokens", async (tokens) => {
      await pg("stores")
        .update({ google_key: tokens })
        .where({ url: shopData.url });
    });

    const client = new GoogleAdsApi({
      client_id: GOOGLE_CLIENT_ID,
      client_secret: GOOGLE_CLIENT_SECRET,
      developer_token: GOOGLE_DEVELOPER_TOKEN,
    });

    let keysData = JSON.parse(shopData.google_key);

    if (!keysData) {
      return false;
    }

    let customers = await client.listAccessibleCustomers({
      refresh_token: keysData.refresh_token,
    });

    let cid = "";
    for (let letter in customers[0]) {
      cid = cid + customers[0][letter];

      if (letter == "2" || letter == "5") {
        cid = cid + "-";
      }
    }

    const customer = client.Customer({
      customer_account_id: cid,
      refresh_token: keysData.refresh_token,
    });

    let customersList = await customer.customerClients.list();

    for (let i = 0; i < customersList.length; i++) {
      let customer = customersList[i];

      if (customer.customer_client.manager === true) {
        continue;
      }

      let customerForCampaingnsData = client.Customer({
        customer_account_id: customer.customer_client.client_customer.replace(
          "customers/",
          ""
        ),
        login_customer_id: cid,
        refresh_token: keysData.refresh_token,
      });

      let spends = await customerForCampaingnsData.query(
        "SELECT metrics.cost_micros, campaign.id, campaign.name FROM campaign WHERE segments.date DURING TODAY"
      );
      let today = Moment();
      for (let i = 0; i < spends.length; i++) {
        await GoogleSpend(sequelize).upsert({
          campaign_id: spends[i].campaign.id,
          campaign_name: spends[i].campaign.name,
          spend: spends[i].metrics.cost_micros / 1000000,
          date_start: today.format("YYYY-MM-DD"),
          date_stop: today.format("YYYY-MM-DD"),
          store_id: shopData.id,
        });
      }
    }
  },
};
