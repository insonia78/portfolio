/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Refund.init(sequelize, DataTypes);
};

class Refund extends Sequelize.Model {
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
        amount: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "refunds",
        schema: "public",
        timestamps: false,
      }
    );
    return Refund;
  }

  static async createRefundFromWebhook(refund, order) {
    let refundAmount = 0;
    for (let j = 0; j < refund.transactions.length; j++) {
      refundAmount = refundAmount + refund.transactions[j].amount;
    }

    let refundsData = {
      id: refund.id,
      order_id: order.id,
      amount: refundAmount,
      created_at: refund.created_at,
    };

    await this.upsert(refundsData);
  }
}
