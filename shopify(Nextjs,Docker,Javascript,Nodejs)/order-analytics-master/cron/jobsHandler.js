import processingStatuses from "../processingStatuses";

module.exports = function (cron, pg, sequelize) {
  cron.schedule("*/5 * * * * *", function () {
    console.log("Cron");

    pg("stores")
      .where({ processed: 1 })
      .limit(1)
      .then(async (rows) => {
        if (rows[0] !== undefined) {
          await pg("stores")
            .where("id", "=", rows[0].id)
            .update({ processed: processingStatuses.processing });

          return rows[0];
        } else {
          return false;
        }
      })
      .then(async (shopData) => {
        try {
          if (shopData) {
            const storesHandler = require("./handlers/store");
            await storesHandler.processStore(shopData, pg);

            console.log("Starting orders fetching");
            const ordersHandler = require("./handlers/orders");
            await ordersHandler.processOrders(shopData, pg);
            // await pg('stores').where('id', '=', rows[0].id).update({processed: processingStatuses.done})
          }
        } catch (e) {
          console.log(e.toString() + " Store id: " + shopData.id);
        }
      });
  });

  cron.schedule("*/60 * * * * *", function () {
    console.log("Cron ads");

    pg("stores")
      .then(async (rows) => {
        if (rows[0] !== undefined) {
          return rows;
        } else {
          return false;
        }
      })
      .then(async (shopDatas) => {
        let shopData = {};
        try {
          const adsHandler = require("./handlers/ads");
          for (let i = 0; i < shopDatas.length; i++) {
            shopData = shopDatas[i];
            await adsHandler.processFacebook(shopData, pg, sequelize);
            await adsHandler.processGoogle(shopData, pg, sequelize);
          }
        } catch (e) {
          console.log(
            e.toString() +
              " Store id: " +
              (shopDatas.length > 0 ? shopData.id : "no store")
          );
        }
      });
  });
};
