import * as handlers from "../../server/handlers";
import { gql } from "apollo-boost";
import processingStatuses from "../../processingStatuses";
import upsertItem from "../../upsert";

const produtsBulkOperationMutation = gql`
  mutation {
    bulkOperationRunQuery(
      query: """
            {
        products {
          edges {
            node {
              id
              title
              vendor
              totalInventory
              variants {
                edges {
                  node {
                    id
                    title
                    price
                    inventoryQuantity
                    inventoryItem {
                      unitCost {
                        amount
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
      """
    ) {
      bulkOperation {
        id
        status
      }
      userErrors {
        field
        message
      }
    }
  }
`;

module.exports = {
  getProductsDataFromFile: async function (file) {
    let productsResult = [];
    await fetch(file, { method: "GET" })
      .then((data) => data.text())
      .then((data) => {
        let lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === "") {
            continue;
          }

          let obj = JSON.parse(lines[i]);

          switch (true) {
            case obj.id.startsWith("gid://shopify/ProductVariant/"):
              if (productsResult[obj["__parentId"]].variants === undefined) {
                productsResult[obj["__parentId"]].variants = [];
              }
              productsResult[obj["__parentId"]].variants.push(obj);
              break;
            case obj.id.startsWith("gid://shopify/Product/"):
              if (productsResult[obj.id] === undefined) {
                productsResult[obj.id] = {};
              }

              productsResult[obj.id] = Object.assign(
                productsResult[obj.id],
                obj
              );
              break;
          }
        }
      });

    return productsResult;
  },
  addProductsToDb: async function (products, pg, shopData) {
    for (let key in products) {
      let product = products[key];

      product.id = product.id.replace("gid://shopify/Product/", "");
      let productsData = {
        id: product.id,
        name: product.title,
        vendor: product.vendor,
        inventory: product.totalInventory,
        parent_id: 0,
        store_id: shopData.id,
      };

      upsertItem(pg, "products", "id", productsData);

      for (let i = 0; i < product.variants.length; i++) {
        let variant = product.variants[i];

        variant.id = variant.id.replace("gid://shopify/ProductVariant/", "");

        let variantsData = {
          id: variant.id,
          parent_id: product.id,
          name: variant.title,
          retail_price: variant.price,
          inventory: variant.inventoryQuantity,
          cost:
            variant.inventoryItem.unitCost !== null &&
            variant.inventoryItem.unitCost !== undefined
              ? variant.inventoryItem.unitCost.amount
              : 0,
          store_id: shopData.id,
        };

        upsertItem(pg, "products", "id", variantsData);
      }
    }
  },
  processProducts: async function (shopData, pg) {
    try {
      const client = await handlers.createClient(shopData.url, shopData.key);
      await client
        .mutate({ mutation: produtsBulkOperationMutation })
        .then((response) => {
          if (response.data.bulkOperationRunQuery.userErrors.length > 0) {
            console.log(response.data.bulkOperationRunQuery.userErrors);
            return false;
          }

          let self = this;
          let interval = setInterval(function () {
            client
              .query({
                query: gql`
                  {
                    currentBulkOperation {
                      status
                      errorCode
                      url
                    }
                  }
                `,
              })
              .then(async (statusResponse) => {
                if (
                  statusResponse.data.currentBulkOperation.status ===
                  "COMPLETED"
                ) {
                  clearInterval(interval);

                  console.log("Starting customers fetching");
                  const customersHandler = require("./customers");
                  await customersHandler.processCustomers(shopData, pg);

                  let products = await self.getProductsDataFromFile(
                    statusResponse.data.currentBulkOperation.url,
                    pg
                  );
                  await self.addProductsToDb(products, pg, shopData);
                } else if (statusResponse.data.currentBulkOperation.errorCode) {
                  console.log(
                    statusResponse.data.currentBulkOperation.errorCode
                  );
                  clearInterval(interval);
                }
              });
          }, 10000);
        });
    } catch (e) {
      console.log(e);
      await pg("stores")
        .where("id", "=", shopData.id)
        .update({ processed: processingStatuses.error });
    }
  },
};
