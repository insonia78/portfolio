/* jshint indent: 2 */

import * as handlers from "../handlers";

import Refund from "./refunds";
import Tax from "./taxes";
import LineItem from "./line_items";

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Order.init(sequelize, DataTypes);
};

class Order extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          primaryKey: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        gateway: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        test: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        total_price: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        subtotal_price: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        total_weight: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        total_tax: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        taxes_included: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        confirmed: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        total_discounts: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        referring_site: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cancelled_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
        cancel_reason: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        user_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        location_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        fulfillment_status: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        shipping: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        shipping_tax: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sales_channel: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        cancelled: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        shipping_costs: {
          type: DataTypes.REAL,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "orders",
        schema: "public",
        timestamps: false,
      }
    );
    return Order;
  }

  static async createOrderFromWebhook(order, shopData) {
    let ordersData = {
      id: order.id,
      store_id: shopData.id,
      created_at: order.created_at,
      updated_at: order.updated_at,
      gateway: order.gateway,
      test: order.test,
      total_price: order.total_price,
      subtotal_price: order.subtotal_price,
      total_weight: order.total_weight,
      total_tax: order.total_tax,
      taxes_included: order.taxes_included,
      currency: order.currency,
      confirmed: order.confirmed,
      total_discounts: order.total_discounts,
      referring_site: order.referring_site,
      cancelled_at: order.cancelled_at,
      cancel_reason: order.cancel_reason,
      user_id: order.user_id,
      name: order.name,
      fulfillment_status: order.fulfillment_status,
      sales_channel: order.source_name,
      cancelled: order.cancelled_at !== null,
      shipping_costs: await this.getShippingCosts(order.id, shopData),
    };

    let shipping = 0;
    let shippingTax = 0;
    for (let k = 0; k < order.shipping_lines.length; k++) {
      shipping = shipping + order.shipping_lines[k].price;
      for (let l = 0; l < order.shipping_lines[k].tax_lines.length; l++) {
        shippingTax = shippingTax + order.shipping_lines[k].tax_lines[l].price;
      }
    }

    ordersData.shipping = shipping;
    ordersData.shipping_tax = shippingTax;

    await this.upsert(ordersData);

    for (let i = 0; i < order.refunds.length; i++) {
      let refund = order.refunds[i];
      await Refund(this.sequelize).createRefundFromWebhook(refund, order);
    }

    for (let i = 0; i < order.tax_lines.length; i++) {
      let tax = order.tax_lines[i];
      await Tax(this.sequelize).createTaxFromWebhook(tax, order);
    }

    const client = await handlers.createClient(shopData.url, shopData.key);
    for (let i = 0; i < order.line_items.length; i++) {
      let lineItem = order.line_items[i];

      await LineItem(this.sequelize).createLineItemFromWebhook(
        lineItem,
        client,
        order
      );
    }
  }

  static async getShippingCosts(orderId, shopData) {
    return await fetch(
      "https://" +
        shopData.url +
        "/admin/api/2020-01/orders/" +
        orderId +
        "/events.json?verb=shipping_label_created_success",
      {
        headers: {
          "X-Shopify-Access-Token": shopData.key,
        },
      }
    ).then(async (response) => {
      let events = await response.json();

      if (events.errors !== undefined) {
        console.log(events.errors);
        return 0;
      }

      events = events.events;

      let shippingCosts = 0;
      for (let i = 0; i < events.length; i++) {
        let event = events[i];
        if (event.message.includes("shipping label for")) {
          let cost = event.message
            .replace(/.+shipping label for ./, "")
            .replace(/\.$/, "");

          shippingCosts = shippingCosts + Number.parseFloat(cost);
        }
      }

      return shippingCosts;
    });
  }
}
