/* jshint indent: 2 */

import * as handlers from "../handlers";

import Refund from "./refunds";
import Tax from "./taxes";
import LineItem from "./line_items";

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Customer.init(sequelize, DataTypes);
};

class Customer extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          primaryKey: true,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        email: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        first_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        last_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "customers",
        schema: "public",
        timestamps: false,
      }
    );
    return Customer;
  }

  static async createCustomerFromWebhook(customer, shopData) {
    let customersData = {
      id: customer.id,
      store_id: shopData.id,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      created_at: customer.created_at,
    };

    await this.upsert(customersData);
  }
}
