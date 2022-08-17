export class apiUtils {
  constructor(shopUrl, accessToken) {
    this.shopUrl = shopUrl;
    this.accessToken = accessToken;
  }

  async getAllData(endpoint, entity) {
    let sinceId = 0;
    let result = [];
    let res = [];
    do {
      let res = await fetch(
        endpoint + "&since_id=0" + encodeURIComponent(sinceId),
        {
          headers: {
            "X-Shopify-Access-Token": this.accessToken,
          },
        }
      )
        .then((data) => data.json())
        .then((json) => {
          return json[entity];
        });

      result = result.concat(res);
    } while (res.length !== 0);

    return result;
  }

  async getOrderTotalsByPeriod(from, to) {
    let orders = await this.getAllData(
      "https://" +
        this.shopUrl +
        "/admin/api/2020-10/orders.json?created_at_min=" +
        encodeURIComponent(from.format("llll")) +
        "&created_at_max=" +
        encodeURIComponent(to.format("llll")),
      "orders"
    );

    let total = 0;
    for (let i = 0; i < orders.length; i++) {
      if (orders[i].test) {
        continue;
      }

      total = total + parseFloat(orders[i].total_price);
    }

    return Number(total).toFixed(2);
  }
}
