import * as handlers from "../../server/handlers";
import { gql } from "apollo-boost";
import processingStatuses from "../../processingStatuses";
import upsertItem from "../../upsert";

module.exports = {
  processStore: async function (shopData, pg) {
    await fetch(
      "https://" + shopData.url + "/admin/api/2020-01/currencies.json",
      {
        headers: {
          "X-Shopify-Access-Token": shopData.key,
        },
      }
    ).then(async (response) => {
      let currencies = await response.json();

      if (currencies.errors !== undefined) {
        console.log(currencies.errors);
        throw new Error(currencies.errors);
      }

      currencies = currencies.currencies;
      await pg("stores")
        .update({
          currency:
            currencies[0] !== undefined ? currencies[0].currency : "USD",
        })
        .where({ id: shopData.id });

      return currencies;
    });
  },
};
