/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return GoogleSpend.init(sequelize, DataTypes);
};

class GoogleSpend extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          autoIncrement: true,
          type: DataTypes.INTEGER,
          allowNull: false,
          primaryKey: true,
        },
        campaign_id: {
          type: DataTypes.STRING,
          allowNull: false,
          unique: "unique_all",
        },
        spend: {
          type: DataTypes.REAL,
          allowNull: false,
          unique: "unique_all",
        },
        date_start: {
          type: DataTypes.DATE,
          allowNull: true,
          unique: "unique_all",
        },
        date_stop: {
          type: DataTypes.DATE,
          allowNull: true,
          unique: "unique_all",
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          unique: "unique_all",
        },
        campaign_name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "google_spends",
        schema: "public",
        timestamps: false,
      }
    );
    return GoogleSpend;
  }
}
