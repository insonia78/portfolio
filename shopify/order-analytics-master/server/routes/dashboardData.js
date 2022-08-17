module.exports = function (router, dbUtils) {
  router.get("/api/v1/dashboard-data/:dataType", async (ctx) => {
    try {
      async function getCustomersCount() {
        return await fetch(
          "https://" +
            ctx.cookies.get("shopOrigin") +
            "/admin/api/2019-04/customers/count.json",
          {
            headers: {
              "X-Shopify-Access-Token": ctx.cookies.get("accessToken"),
            },
          }
        )
          .then((response) => response.json())
          .then((json) => {
            return json.count;
          });
      }

      let result = 0;
      let fromDate =
        ctx.query.fromDate !== undefined ? ctx.query.fromDate : false;
      let toDate = ctx.query.toDate !== undefined ? ctx.query.toDate : false;

      let params = [ctx.cookies.get("shopOrigin"), fromDate, toDate];

      switch (ctx.params.dataType) {
        case "orders-count":
          result = await dbUtils.getOrdersCount(...params);
          break;
        case "shipping-charged":
          result = await dbUtils.getShippingCharged(...params);
          break;
        case "taxes":
          result = await dbUtils.getTaxes(...params);
          break;
        case "discounts":
          result = await dbUtils.getDiscounts(...params);
          break;
        case "refunds":
          result = await dbUtils.getRefunds(...params);
          break;
        case "avg-orders":
          result = await dbUtils.getAvgOrderPrice(...params);
          break;
        case "revenue":
          result = await dbUtils.getRevenue(...params);
          break;
        case "cogs":
          result = await dbUtils.getCogs(...params);
          break;
        case "shipping-cost":
          result = await dbUtils.getShippingCost(...params);
          break;
        case "gross-profit":
          result = await dbUtils.getGrossProfit(...params);
          break;
        case "gross-margin":
          result = await dbUtils.getGrossMargin(...params);
          break;
        case "transaction-fee":
          result = await dbUtils.getTransactionFee(...params);
          break;
        case "handling-fee":
          result = await dbUtils.getHandlingFee(...params);
          break;
        case "avg-order-profit":
          result = await dbUtils.getAvgOrderProfit(...params);
          break;
        case "net-profit":
          result = await dbUtils.getNetProfit(...params);
          break;
        case "profit-by-months":
          result = await dbUtils.getProfitByMonths(...params);
          break;
        case "lifetime-customer-value":
          result = await dbUtils.getlifetimeCustomerValue(...params);
          break;
        case "lifetime-customer-value-months":
          result = await dbUtils.getLifetimeCustomerValueByMonths(...params);
          break;
        case "average-order-price-months":
          result = await dbUtils.getAvgOrderPriceByMonths(...params);
          break;
        case "average-order-profit-months":
          result = await dbUtils.getAvgOrderProfitByMonths(...params);
          break;
        case "orders-count-months":
          result = await dbUtils.getOrdersCountByMonths(...params);
          break;
        case "customers-count-months":
          result = await dbUtils.getCustomersCountByMonths(...params);
          break;
        case "customers-count":
          result = await dbUtils.getCustomersCount(...params);
          break;
        case "revenue-by-channels":
          result = await dbUtils.getRevenueByChannels(...params);
          break;
        case "revenue-by-channel-by-months":
          result = await dbUtils.getRevenueByChannelByMonths(
            ...params,
            ctx.query.channel
          );
          break;
        case "adspend":
          result = await dbUtils.getAdspend(...params);
          break;
        case "adspend-per-order":
          result = await dbUtils.getAdspendPerOrder(...params);
          break;
        case "adspend-total-by-months":
          result = await dbUtils.getAdspendTotalByMonth(...params);
          break;
        case "adspend-average-by-months":
          result = await dbUtils.getAdspendAverageByMonth(...params);
          break;
        case "campaigns-table":
          result = await dbUtils.getCampaignsForTable(...params);
          break;
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
