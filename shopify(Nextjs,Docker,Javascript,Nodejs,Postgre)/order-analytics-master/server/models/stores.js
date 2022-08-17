/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Store.init(sequelize, DataTypes);
};

class Store extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        url: {
          type: DataTypes.STRING,
          allowNull: true,
          unique: "url_unique",
        },
        key: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        processed: {
          type: DataTypes.INTEGER,
          allowNull: true,
          defaultValue: 1,
        },
        currency: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "stores",
        schema: "public",
        timestamps: false,
      }
    );
    return Store;
  }
}
