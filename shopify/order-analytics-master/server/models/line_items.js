/* jshint indent: 2 */

import { gql } from "apollo-boost";

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return LineItem.init(sequelize, DataTypes);
};

class LineItem extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          primaryKey: true,
        },
        order_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        quantity: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        sku: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        price: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        price_with_discount: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        product_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        total_discount: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        cost: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        refunded: {
          type: DataTypes.BOOLEAN,
          allowNull: true,
        },
        variant_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "line_items",
        schema: "public",
        timestamps: false,
      }
    );
    return LineItem;
  }

  static async createLineItemFromWebhook(lineItem, client, order) {
    const costQuery = gql`
      query COST($variantId: ID!) {
        productVariant(id: $variantId) {
          inventoryItem {
            unitCost {
              amount
            }
          }
        }
      }
    `;
    let cost = await client
      .query({
        query: costQuery,
        variables: {
          variantId: "gid://shopify/ProductVariant/" + lineItem.variant_id,
        },
      })
      .then(async (data) => {
        console.log(data.data.productVariant.inventoryItem.unitCost.amount);
        return data.data.productVariant.inventoryItem.unitCost.amount;
      });

    console.log(cost);

    let lineItemsData = {
      id: lineItem.id,
      order_id: order.id,
      variant_id: lineItem.variant_id,
      quantity: lineItem.quantity,
      sku: lineItem.sku,
      cost: cost,
      price: lineItem.price,
      price_with_discount: lineItem.price - lineItem.total_discount,
      product_id: lineItem.product_id,
      total_discount: lineItem.total_discount,
      refunded: false, //TODO check when processing refunds
    };

    await this.upsert(lineItemsData);
  }
}
