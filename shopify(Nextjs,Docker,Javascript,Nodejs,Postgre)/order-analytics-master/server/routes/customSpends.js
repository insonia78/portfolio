module.exports = function (router, dbUtils) {
  router.post("/api/v1/custom-spends", async (ctx) => {
    try {
      await dbUtils.updateProductHandling(
        ctx.params.id,
        ctx.query.handling !== undefined ? ctx.query.handling : 0,
        ctx.cookies.get("shopOrigin")
      );

      ctx.body = {
        status: "success",
        data: [],
      };
    } catch (e) {
      console.log(e);
      ctx.body = {
        status: "failed",
        data: [],
      };
    }
  }),
    router.get("/api/v1/custom-spends-categories", async (ctx) => {
      try {
        ctx.body = {
          status: "success",
          data: await dbUtils.getCustomSpendsCategories(
            ctx.cookies.get("shopOrigin")
          ),
        };
      } catch (e) {
        console.log(e);
        ctx.body = {
          status: "failed",
          data: [],
        };
      }
    }),
    router.get("/api/v1/custom-spends", async (ctx) => {
      try {
        let offset = 0;
        let limit = 10;
        if (ctx.params.limit !== undefined) {
          limit = ctx.params.limit;
        }

        if (ctx.params.page !== undefined) {
          offset = (ctx.params.page - 1) * limit;
        }

        let customSpends = await dbUtils.getCustomSpends([], limit, offset);

        ctx.body = {
          status: "success",
          data: customSpends,
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
