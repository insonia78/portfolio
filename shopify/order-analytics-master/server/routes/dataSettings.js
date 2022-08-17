module.exports = function (router, dbUtils) {
  router.get(
    "/api/v1/data-settings/products/save-handling/:id",
    async (ctx) => {
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
    }
  ),
    router.get("/api/v1/data-settings/products/", async (ctx) => {
      try {
        function getMargin(price, cost) {
          return 100 - Math.round(cost / (price / 100));
        }

        let offset = 0;
        let limit = 10;
        if (ctx.params.limit !== undefined) {
          limit = ctx.params.limit;
        }

        if (ctx.params.page !== undefined) {
          offset = (ctx.params.page - 1) * limit;
        }

        let products = await dbUtils
          .getProducts(
            [
              "id",
              "name",
              "vendor",
              "retail_price",
              "handling_fee",
              "cost",
              "inventory",
              "parent_id",
            ],
            limit,
            offset
          )
          .then((products) => {
            return products.map((product) => {
              product.margin = getMargin(product.retail_price, product.cost);
              product.variants.map((variant) => {
                variant.margin = getMargin(variant.retail_price, variant.cost);

                return variant;
              });

              return product;
            });
          });

        ctx.body = {
          status: "success",
          data: products,
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
