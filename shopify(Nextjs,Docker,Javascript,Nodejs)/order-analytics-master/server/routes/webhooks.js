module.exports = function (router, dbUtils, webhook) {
  router.post("/webhooks/products/create", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook);

    dbUtils.insertProduct(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });

  router.post("/webhooks/products/update", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook);

    dbUtils.insertProduct(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });

  router.post("/webhooks/orders/create", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook.payload);

    dbUtils.insertOrder(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });

  router.post("/webhooks/orders/update", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook.payload);

    dbUtils.insertOrder(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });

  router.post("/webhooks/customers/create", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook.payload);

    dbUtils.insertCustomer(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });

  router.post("/webhooks/customers/update", webhook, async (ctx) => {
    // console.log("received webhook: ", ctx.state.webhook.payload);

    dbUtils.insertCustomer(ctx.state.webhook.payload, ctx.state.webhook.domain);

    ctx.response.status = 200;
  });
};
