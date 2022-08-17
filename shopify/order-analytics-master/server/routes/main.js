module.exports = function (router, dbUtils) {
  router.get("/api/v1/store-data/last-days-profit", async (ctx) => {
    try {
      let data = await dbUtils.getProfitByDays(
        ctx.cookies.get("shopOrigin"),
        ctx.query.days
      );

      ctx.body = {
        status: "success",
        data: data,
      };
    } catch (e) {
      ctx.body = {
        status: "failed",
        data: e.toString(),
      };
    }
  });

  router.get("/api/v1/store-data/last-days-sales", async (ctx) => {
    try {
      let data = await dbUtils.getSalesByDays(
        ctx.cookies.get("shopOrigin"),
        ctx.query.days
      );

      ctx.body = {
        status: "success",
        data: data,
      };
    } catch (e) {
      ctx.body = {
        status: "failed",
        data: e.toString(),
      };
    }
  });

  router.get("/api/v1/store-data/currency", async (ctx) => {
    try {
      let currency = await dbUtils.getStoreCurrency(
        ctx.cookies.get("shopOrigin")
      );

      ctx.body = {
        status: "success",
        data: currency,
      };
    } catch (e) {
      ctx.body = {
        status: "failed",
        data: e.toString(),
      };
    }
  });

  router.get("/api/v1/store-data/main", async (ctx) => {
    try {
      return await fetch(
        "https://" +
          ctx.cookies.get("shopOrigin") +
          "/admin/api/2020-10/shop.json",
        {
          headers: {
            "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          ctx.body = {
            status: "success",
            data: json,
          };
        });
    } catch (e) {
      ctx.body = {
        status: "failed",
        data: e.toString(),
      };
    }
  });
};
