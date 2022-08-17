/* jshint indent: 2 */

const { Sequelize, DataTypes } = require("sequelize");
module.exports = (sequelize) => {
  return Product.init(sequelize, DataTypes);
};

class Product extends Sequelize.Model {
  static init(sequelize, DataTypes) {
    super.init(
      {
        id: {
          type: DataTypes.BIGINT,
          allowNull: false,
          primaryKey: true,
        },
        name: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        vendor: {
          type: DataTypes.STRING,
          allowNull: true,
        },
        retail_price: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        handling_fee: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        cost: {
          type: DataTypes.REAL,
          allowNull: true,
        },
        inventory: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
        parent_id: {
          type: DataTypes.BIGINT,
          allowNull: true,
        },
        store_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
        },
      },
      {
        sequelize,
        tableName: "products",
        schema: "public",
        timestamps: false,
      }
    );
    return Product;
  }

  static async createProductFromWebhook(product, shopData) {
    let productsData = {
      id: product.id,
      name: product.title,
      vendor: product.vendor,
      parent_id: 0,
      store_id: shopData.id,
    };

    let totalInventory = 0;
    for (let i = 0; i < product.variants.length; i++) {
      let variant = product.variants[i];

      let cost = await fetch(
        "https://" +
          shopData.url +
          "/admin/api/2019-04/inventory_items/" +
          variant["inventory_item_id"] +
          ".json",
        {
          headers: {
            "X-Shopify-Access-Token": shopData.key,
          },
        }
      )
        .then((response) => response.json())
        .then((json) => {
          return json.inventory_item.cost;
        });

      let variantsData = {
        id: variant.id,
        parent_id: product.id,
        name: variant.title,
        retail_price: variant.price,
        inventory: variant.inventory_quantity,
        cost: cost,
        store_id: shopData.id,
      };
      totalInventory = totalInventory + variant.inventory_quantity;

      await this.upsert(variantsData);
    }

    productsData.inventory = totalInventory;

    await this.upsert(productsData);
  }
}
