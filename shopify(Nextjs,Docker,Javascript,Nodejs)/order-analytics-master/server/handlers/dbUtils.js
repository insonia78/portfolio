import upsertItem from "../../upsert";
import { gql } from "apollo-boost";
import * as handlers from "./index";
import Product from "../models/products";
import Moment from "moment";
import Order from "../models/orders";
import Store from "../models/stores";
import CustomSpendCategory from "../models/custom_spends_categories";
import CustomSpend from "../models/custom_spends";
import Customer from "../models/customers";

export class dbUtils {
  constructor(pg, sequelize) {
    this.pg = pg;
    this.sequelize = sequelize;
  }

  getFromDateForSql(from) {
    return from + " 00:00:00";
  }

  getToDateForSql(to) {
    return to + " 23:59:59";
  }

  async getOrdersCount(storeUrl, from, to) {
    let countQuery = this.pg("orders")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl })
      .count();

    if (from) {
      countQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      countQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let count = await countQuery;

    return count[0].count !== undefined ? count[0].count : false;
  }

  async getShippingCharged(storeUrl, from, to) {
    let shippingQuery = this.pg("orders")
      .sum("shipping")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      shippingQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      shippingQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let shipping = await shippingQuery;

    return shipping[0].sum !== undefined ? shipping[0].sum : 0;
  }

  async getTaxes(storeUrl, from, to) {
    let taxesQuery = this.pg("orders")
      .sum("total_tax")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      taxesQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      taxesQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let taxes = await taxesQuery;

    return taxes[0].sum !== undefined ? Number(taxes[0].sum).toFixed(2) : false;
  }

  async getDiscounts(storeUrl, from, to) {
    let discountsQuery = this.pg("orders")
      .sum("total_discounts")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      discountsQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      discountsQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let discounts = await discountsQuery;

    return discounts[0].sum !== undefined ? discounts[0].sum : 0;
  }

  async getRefunds(storeUrl, from, to) {
    let refundsQuery = this.pg("orders")
      .sum("refunds.amount")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .leftJoin("refunds", "refunds.order_id", "=", "orders.id")
      .where({ url: storeUrl });

    if (from) {
      refundsQuery.andWhere(
        "orders.created_at",
        ">=",
        this.getFromDateForSql(from)
      );
    }

    if (to) {
      refundsQuery.andWhere(
        "orders.created_at",
        "<=",
        this.getToDateForSql(to)
      );
    }

    let refunds = await refundsQuery;

    return refunds[0].sum !== undefined ? refunds[0].sum : false;
  }

  async getAvgOrderPrice(storeUrl, from, to) {
    let priceQuery = this.pg("orders")
      .avg("total_price")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      priceQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      priceQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let price = await priceQuery;

    return price[0].avg !== undefined ? Number(price[0].avg).toFixed(2) : false;
  }

  async getCogs(storeUrl, from, to) {
    let cogsQuery = this.pg("orders")
      .sum("cost")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .leftJoin("line_items", "orders.id", "=", "line_items.order_id")
      .where({ url: storeUrl })
      .andWhere({ refunded: false });

    if (from) {
      cogsQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      cogsQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let cogs = await cogsQuery;

    return cogs[0].sum !== undefined ? Number(cogs[0].sum).toFixed(2) : false;
  }

  async getShippingCost(storeUrl, from, to) {
    let shippingQuery = this.pg("orders")
      .sum("shipping_costs")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      shippingQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      shippingQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let shipping = await shippingQuery;

    return shipping[0].sum !== undefined ? shipping[0].sum : 0;
  }

  async getHandlingFee(storeUrl, from, to) {
    let handlingQuery = this.pg("orders")
      .sum("handling_fee")
      .leftJoin("stores", "orders.store_id", "=", "stores.id")
      .leftJoin("line_items", "orders.id", "=", "line_items.order_id")
      .leftJoin("products", "line_items.variant_id", "=", "products.id")
      .where({ url: storeUrl })
      .andWhere({ refunded: false });

    if (from) {
      handlingQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      handlingQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let handling = await handlingQuery;

    return handling[0].sum !== undefined
      ? Number(handling[0].sum).toFixed(2)
      : false;
  }

  async getTransactionFee(storeUrl, from, to) {
    return 0; //TODO implement
  }

  async getSales(storeUrl, from, to) {
    let where = "";
    let params = [storeUrl];
    if (from) {
      where = " and created_at >= ?";
      params.push(this.getFromDateForSql(from));
    }

    if (to) {
      where = where + " and created_at <= ?";
      params.push(this.getToDateForSql(to));
    }

    return await this.pg
      .raw(
        'select sum((total_price - "o"."total_discounts" - COALESCE(sum, 0))) as revenue from orders as o\n' +
          "left join (select order_id, sum(amount) from refunds group by order_id) as r\n" +
          "on o.id = r.order_id\n" +
          "left join stores as s\n" +
          "on s.id = o.store_id\n" +
          "where s.url = ?" +
          where,
        params
      )
      .then(async (resp) => {
        return resp.rows[0].revenue !== undefined
          ? Number(resp.rows[0].revenue).toFixed(2)
          : 0;
      });
  }

  async getRevenue(storeUrl, from, to) {
    return (
      (await this.getSales(storeUrl, from, to)) -
      (await this.getFacebookAdsCosts(storeUrl)) -
      (await this.getGoogleAdsCosts(storeUrl, from, to))
    );
  }

  async getRevenueByChannels(storeUrl, from, to) {
    let where = "";
    let params = [storeUrl];
    if (from) {
      where = " and created_at >= ?";
      params.push(this.getFromDateForSql(from));
    }

    if (to) {
      where = where + " and created_at <= ?";
      params.push(this.getToDateForSql(to));
    }

    return await this.pg
      .raw(
        "select sum((total_price - \"o\".\"total_discounts\" - COALESCE(sum, 0))) as revenue, case o.sales_channel when '' then 'Unknown' else o.sales_channel end " +
          "from orders as o\n" +
          "left join (select order_id, sum(amount) from refunds group by order_id) as r\n" +
          "on o.id = r.order_id\n" +
          "left join stores as s\n" +
          "on s.id = o.store_id\n" +
          "where s.url = ?" +
          where +
          "group by o.sales_channel\n",
        params
      )
      .then(async (resp) => {
        let result = {};
        for (let i = 0; i < resp.rows.length; i++) {
          result[resp.rows[i].sales_channel] = resp.rows[i].revenue;
        }

        return result;
      });
  }

  async getRevenueByChannel(storeUrl, from, to, channel) {
    let where = "";
    let params = [storeUrl];
    if (from) {
      where = " and created_at >= ?";
      params.push(this.getFromDateForSql(from));
    }

    if (to) {
      where = where + " and created_at <= ?";
      params.push(this.getToDateForSql(to));
    }

    if (channel === "Unknown") {
      channel = "";
    }

    params.push(channel);

    let query = this.pg.raw(
      'select sum((total_price - "o"."total_discounts" - COALESCE(sum, 0))) as revenue ' +
        "from orders as o\n" +
        "left join (select order_id, sum(amount) from refunds group by order_id) as r\n" +
        "on o.id = r.order_id\n" +
        "left join stores as s\n" +
        "on s.id = o.store_id\n" +
        "where s.url = ?" +
        where +
        " and o.sales_channel= ? " +
        "group by o.sales_channel\n",
      params
    );

    console.log(query.toString());

    return await query.then(async (resp) => {
      if (resp.rows[0] === undefined) {
        return 0;
      }

      return Number(resp.rows[0].revenue).toFixed(2);
    });
  }

  async getGrossProfit(storeUrl, from, to) {
    return Number(
      (await this.getRevenue(storeUrl, from, to)) -
        (await this.getCogs(storeUrl, from, to)) -
        (await this.getShippingCost(storeUrl, from, to)) -
        (await this.getHandlingFee(storeUrl, from, to)) -
        (await this.getTaxes(storeUrl, from, to)) -
        (await this.getTransactionFee(storeUrl, from, to))
    ).toFixed(2);
  }

  async getNetProfit(storeUrl, from, to) {
    return Number(
      (await this.getRevenue(storeUrl, from, to)) -
        (await this.getCogs(storeUrl, from, to))
    ).toFixed(2);
  }

  async getGrossMargin(storeUrl, from, to) {
    return Number(
      (await this.getGrossProfit(storeUrl, from, to)) /
        (await this.getRevenue(storeUrl, from, to))
    ).toFixed(2);
  }

  async getAvgOrderProfit(storeUrl, from, to) {
    let ordersCount = await this.getOrdersCount(storeUrl, from, to);

    return ordersCount == 0
      ? 0
      : Number(
          (await this.getGrossProfit(storeUrl, from, to)) / ordersCount
        ).toFixed(2);
  }

  async getCustomersCount(storeUrl, from, to) {
    let countQuery = this.pg("customers")
      .leftJoin("stores", "customers.store_id", "=", "stores.id")
      .where({ url: storeUrl })
      .count();

    if (from) {
      countQuery.andWhere("created_at", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      countQuery.andWhere("created_at", "<=", this.getToDateForSql(to));
    }

    let count = await countQuery;

    return count[0].count !== undefined ? count[0].count : 0;
  }

  async getlifetimeCustomerValue(storeUrl, from, to) {
    let customersCount = await this.getCustomersCount(storeUrl, from, to);

    if (customersCount == 0) {
      return 0;
    }

    return Number(
      (await this.getAvgOrderProfit(storeUrl, from, to)) *
        ((await this.getOrdersCount(storeUrl, from, to)) / customersCount)
    ).toFixed(2);
  }

  async getStoreCurrency(storeUrl) {
    return await this.pg("stores")
      .where({ url: storeUrl })
      .then((storeData) => storeData[0].currency);
  }

  async getProducts(fields, limit, offset) {
    return await this.pg
      .select(fields.length > 0 ? fields : "*")
      .from("products")
      .where({ parent_id: 0 })
      .limit(limit)
      .offset(offset)
      .then(async (data) => {
        for (let i = 0; i < data.length; i++) {
          data[i].variants = await this.pg
            .select(fields.length > 0 ? fields : "*")
            .from("products")
            .where({ parent_id: data[i].id });
        }

        return data;
      });
  }

  async getCustomSpends(fields, limit, offset) {
    return await this.pg
      .select(fields.length > 0 ? fields : "*")
      .from("custom_spends")
      .limit(limit)
      .offset(offset)
      .then(async (data) => {
        return data;
      });
  }

  async updateProductHandling(id, handling, shop) {
    await this.pg("products")
      .update({ handling_fee: handling })
      .where("store_id", this.pg.select("id").from("stores").where("url", shop))
      .andWhere({ id: id });
  }

  async getShopData(shop) {
    return await this.pg("stores")
      .where("url", shop)
      .limit(1)
      .then((data) => (data[0] !== undefined ? data[0] : false));
  }

  async insertProduct(product, shop) {
    let shopData = await this.getShopData(shop);
    await Product(this.sequelize).createProductFromWebhook(product, shopData);
  }

  async insertOrder(order, shop) {
    let shopData = await this.getShopData(shop);

    await Order(this.sequelize).createOrderFromWebhook(order, shopData);
  }

  async insertCustomer(customer, shop) {
    let shopData = await this.getShopData(shop);

    await Customer(this.sequelize).createCustomerFromWebhook(
      customer,
      shopData
    );
  }

  async getCustomSpendsCategories(shop) {
    return await CustomSpendCategory.findAll({
      where: {
        store_id: this.getShopData(shop).id,
      },
    });
  }

  async updateStore(shop, data) {
    await this.pg("stores").update(data).where({ url: shop });
  }

  async getFacebookAdsCosts(storeUrl) {
    let adsCost = await this.pg("facebook_spends")
      .sum("spend")
      .leftJoin("stores", "facebook_spends.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    return adsCost[0].sum !== undefined ? Number(adsCost[0].sum).toFixed(2) : 0;
  }

  async getGoogleAdsCosts(storeUrl, from, to) {
    let adsCost = this.pg("google_spends")
      .sum("spend")
      .leftJoin("stores", "google_spends.store_id", "=", "stores.id")
      .where({ url: storeUrl });

    if (from) {
      adsCost.andWhere("date_start", ">=", this.getFromDateForSql(from));
    }

    if (to) {
      adsCost.andWhere("date_stop", "<=", this.getToDateForSql(to));
    }

    adsCost = await adsCost;

    return adsCost[0].sum !== undefined ? Number(adsCost[0].sum).toFixed(2) : 0;
  }

  async getCustomSpends(shop) {
    return await CustomSpend.findAll({
      where: {
        store_id: this.getShopData(shop).id,
      },
    });
  }

  async getProfitByDays(storeUrl, daysCount) {
    let res = [];

    for (let i = daysCount; i >= 0; i--) {
      let currentDay = Moment();
      currentDay.subtract(i, "day");
      let formatted = currentDay.format("YYYY-MM-DD");

      res.push(await this.getGrossProfit(storeUrl, formatted, formatted));
    }

    return res;
  }

  async getValuesByMonths(storeUrl, from, to, callback, additionalParams) {
    let res = [];
    if (additionalParams === undefined) {
      additionalParams = [];
    }

    if (to.isBefore(from)) {
      console.log("End date must be greated than start date.");
      return res;
    }

    while (from.isBefore(to)) {
      let oldStartDate = from.clone();
      from.add(1, "month");

      res.push(
        await callback(
          storeUrl,
          oldStartDate.format("YYYY-MM-DD"),
          from.format("YYYY-MM-DD"),
          ...additionalParams
        )
      );
    }

    return res;
  }

  async getProfitByMonths(storeUrl, from, to) {
    if (!from) {
      let created = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getRevenue.bind(this)
    );
  }

  async getLifetimeCustomerValueByMonths(storeUrl, from, to) {
    if (!from) {
      let createdOrders = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      let createdCustomers = await this.pg("customers")
        .min("created_at")
        .leftJoin("stores", "customers.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      createdOrders = Moment(createdOrders[0].min);
      createdCustomers = Moment(createdCustomers[0].min);

      from = createdOrders;
      if (createdOrders.isAfter(createdCustomers)) {
        from = createdCustomers;
      }
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getlifetimeCustomerValue.bind(this)
    );
  }

  async getAvgOrderPriceByMonths(storeUrl, from, to) {
    if (!from) {
      let created = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getAvgOrderPrice.bind(this)
    );
  }

  async getAvgOrderProfitByMonths(storeUrl, from, to) {
    if (!from) {
      let created = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getAvgOrderProfit.bind(this)
    );
  }

  async getOrdersCountByMonths(storeUrl, from, to) {
    if (!from) {
      let created = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getOrdersCount.bind(this)
    );
  }

  async getCustomersCountByMonths(storeUrl, from, to) {
    if (!from) {
      let created = await this.pg("customers")
        .min("created_at")
        .leftJoin("stores", "customers.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getCustomersCount.bind(this)
    );
  }

  async getAdspend(storeUrl, from, to) {
    let where = "";
    let params = [storeUrl];
    if (from) {
      where = " and date_start >= ?";
      params.push(this.getFromDateForSql(from));
    }

    if (to) {
      where = where + " and date_start <= ?";
      params.push(this.getToDateForSql(to));
    }

    return await this.pg
      .raw(
        "select " +
          "(select sum(spend) from facebook_spends as sp \n" +
          "left join stores as s\n" +
          "on s.id = sp.store_id\n" +
          " where s.url = ? \n" +
          where +
          ") as spend1,\n" +
          "(select sum(spend) from facebook_spends as sp \n" +
          "left join stores as s\n" +
          "on s.id = sp.store_id\n" +
          " where s.url = ? \n" +
          where +
          " ) as spend2\n",
        [...params, ...params]
      )
      .then(async (resp) => {
        return Number(resp.rows[0].spend1 + resp.rows[0].spend2).toFixed(2);
      });
  }

  async getAdspendAverage(storeUrl, from, to) {
    let start = Moment(this.getFromDateForSql(from));
    let end = Moment(this.getToDateForSql(to));

    let days = end.diff(start, "days") + 1;

    if (days) {
      return Number((await this.getAdspend(storeUrl, from, to)) / days).toFixed(
        2
      );
    }

    return 0;
  }

  async getAdspendAverageByMonth(storeUrl, from, to) {
    if (!from) {
      let createdFacebook = await this.pg("facebook_spends")
        .min("date_start")
        .leftJoin("stores", "facebook_spends.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      let createdGoogle = await this.pg("google_spends")
        .min("date_start")
        .leftJoin("stores", "google_spends.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      createdFacebook = Moment(createdFacebook[0].min);
      createdGoogle = Moment(createdGoogle[0].min);

      from = createdFacebook;
      if (createdFacebook.isAfter(createdGoogle)) {
        from = createdGoogle;
      }
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getAdspendAverage.bind(this)
    );
  }

  async getAdspendPerOrder(storeUrl, from, to) {
    let ordersCount = await this.getOrdersCount(storeUrl, from, to);
    let adspend = await this.getAdspend(storeUrl, from, to);

    if (ordersCount == 0 || adspend == 0) {
      return 0;
    }

    return await Number(adspend / ordersCount).toFixed(2);
  }

  async getAdspendTotalByMonth(storeUrl, from, to) {
    if (!from) {
      let createdFacebook = await this.pg("facebook_spends")
        .min("date_start")
        .leftJoin("stores", "facebook_spends.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      let createdGoogle = await this.pg("google_spends")
        .min("date_start")
        .leftJoin("stores", "google_spends.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      createdFacebook = Moment(createdFacebook[0].min);
      createdGoogle = Moment(createdGoogle[0].min);

      from = createdFacebook;
      if (createdFacebook.isAfter(createdGoogle)) {
        from = createdGoogle;
      }
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getAdspend.bind(this)
    );
  }

  async getRevenueByChannelByMonths(storeUrl, from, to, channel) {
    if (!from) {
      let created = await this.pg("orders")
        .min("created_at")
        .leftJoin("stores", "orders.store_id", "=", "stores.id")
        .where({ url: storeUrl });

      from = Moment(created[0].min);
    } else {
      from = Moment(from);
    }

    to = to ? Moment(to) : Moment();

    return await this.getValuesByMonths(
      storeUrl,
      from,
      to,
      this.getRevenueByChannel.bind(this),
      [channel]
    );
  }

  async getSalesByDays(storeUrl, daysCount) {
    let res = [];

    for (let i = daysCount; i >= 0; i--) {
      let currentDay = Moment();
      currentDay.subtract(i, "day");
      let formatted = currentDay.format("YYYY-MM-DD");

      res.push(await this.getSales(storeUrl, formatted, formatted));
    }

    return res;
  }

  async getCampaignsForTable(storeUrl, from, to) {
    let result = [];

    let adsTables = ["google_spends", "facebook_spends"];

    for (let table of adsTables) {
      let where = "";
      let params = [storeUrl];
      if (from) {
        where = " and date_start >= ? ";
        params.push(this.getFromDateForSql(from));
      }

      if (to) {
        where = where + " and date_start <= ? ";
        params.push(this.getToDateForSql(to));
      }

      let query = this.pg.raw(
        "select sum(spend) as spend, campaign_name from " +
          table +
          " as o\n" +
          "left join stores as s\n" +
          "on s.id = o.store_id\n" +
          "where s.url = ?" +
          where +
          " group by campaign_name",
        params
      );

      await query.then((data) => {
        for (let i = 0; i < data.rows.length; i++) {
          result.push({
            campaign_name: {
              id: "campaign_name",
              value: data.rows[i].campaign_name,
            },
            spend: { id: "spend", value: data.rows[i].spend },
          });
        }
      });
    }

    return result;
  }

  async getIntegrationStatus(storeUrl, integrationType) {
    return await this.pg("stores")
      .where({ url: storeUrl })
      .then((resp) => {
        return (
          resp[0][integrationType + "_key"] !== "" &&
          resp[0][integrationType + "_key"] !== null
        );
      });
  }
}
