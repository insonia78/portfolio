/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Tax.init(sequelize, DataTypes);
};

class Tax extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        order_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
          unique: "taxes_unique",
        },
        price: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        rate: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        title: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: "taxes_unique",
        },
      },
      {
        sequelize,
        tableName: "taxes",
        schema: "public",
        timestamps: false,
      }
    );
    return Tax;
  }

  static async createTaxFromWebhook(tax, order) {
    let taxesData = {
      order_id: order.id,
      price: tax.price,
      rate: tax.rate,
      title: tax.title,
    };

    await this.upsert(taxesData);
  }
}
