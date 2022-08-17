import * as handlers from "../../server/handlers";
import { gql } from "apollo-boost";
import processingStatuses from "../../processingStatuses";
import upsertItem from "../../upsert";

const ordersBulkOperationMutation = gql`
  mutation {
    bulkOperationRunQuery(
      query: """
          {
        orders {
          edges {
            node {
              id
              createdAt
              updatedAt
              paymentGatewayNames
              test
              cancelledAt
              events {
                edges {
                  node {
                    id
                    message
                  }
                }
              }
              publication {
                name
              }
              totalPriceSet {
                shopMoney {
                  amount
                }
              }
              subtotalPriceSet {
                shopMoney {
                  amount
                }
              }
              totalShippingPriceSet {
                shopMoney {
                  amount
                }
              }
              shippingLine {
                taxLines {
                  priceSet {
                    shopMoney {
                      amount
                    }
                  }
                }
              }
              totalWeight
              totalTaxSet {
                shopMoney {
                  amount
                }
              }
              taxesIncluded
              currencyCode
              confirmed
              referrerUrl
              cancelledAt
              cancelReason
              customer {
                id
              }
              name
              fulfillments {
                status
              }
              totalDiscountsSet {
                shopMoney {
                  amount
                }
              }
              taxLines {
                priceSet {
                  shopMoney {
                    amount
                  }
                }
                rate
                title
              }
              shippingLine {
                code
                originalPriceSet {
                  shopMoney {
                    amount
                  }
                }
              }
              lineItems {
                edges {
                  node {
                    id
                    quantity
                    sku
                    refundableQuantity
                    variant {
                    id
                    inventoryItem {
                      id
                        unitCost {
                          amount
                        }
                      }
                    }
                    originalUnitPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                    discountedUnitPriceSet {
                      shopMoney {
                        amount
                      }
                    }
                    product {
                      id
                    }
                    totalDiscountSet {
                      shopMoney {
                        amount
                      }
                    }
                  }
                }
              }
              refunds {
                id
                createdAt
                totalRefundedSet {
                  shopMoney {
                    amount
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
  getOrdersDataFromFile: async function (file) {
    let ordersResult = [];
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
            case obj.id.startsWith("gid://shopify/Order"):
              if (ordersResult[obj.id] === undefined) {
                ordersResult[obj.id] = {};
              }

              ordersResult[obj.id] = Object.assign(ordersResult[obj.id], obj);
              break;
            case obj.id.startsWith("gid://shopify/LineItem"):
              if (ordersResult[obj["__parentId"]].lineItems === undefined) {
                ordersResult[obj["__parentId"]].lineItems = [];
              }
              ordersResult[obj["__parentId"]].lineItems.push(obj);
              break;
            case obj.id.startsWith("gid://shopify/BasicEvent"):
              if (ordersResult[obj["__parentId"]].events === undefined) {
                ordersResult[obj["__parentId"]].events = [];
              }
              ordersResult[obj["__parentId"]].events.push(obj);
              break;
          }
        }
      });

    return ordersResult;
  },
  addOrdersToDb: async function (orders, pg, shopData) {
    for (let key in orders) {
      let order = orders[key];
      // if (order.test === true) {
      //   continue;
      // }

      let shippingCosts = 0;
      for (let i = 0; i < order.events.length; i++) {
        let event = order.events[i];
        if (event.message.includes("shipping label for")) {
          let cost = event.message
            .replace(/.+shipping label for ./, "")
            .replace(/\.$/, "");

          shippingCosts = shippingCosts + Number.parseFloat(cost);
        }
      }

      order.id = order.id.replace("gid://shopify/Order/", "");
      let ordersData = {
        id: order.id,
        store_id: shopData.id,
        created_at: order.createdAt,
        updated_at: order.updatedAt,
        gateway:
          order.paymentGatewayNames[0] === undefined
            ? ""
            : order.paymentGatewayNames[0],
        test: order.test,
        total_price: order.totalPriceSet.shopMoney.amount,
        subtotal_price: order.subtotalPriceSet.shopMoney.amount,
        total_weight: order.totalWeight,
        total_tax: order.totalTaxSet.shopMoney.amount,
        taxes_included: order.taxesIncluded,
        currency: order.currencyCode,
        confirmed: order.confirmed,
        total_discounts: order.totalDiscountsSet.shopMoney.amount,
        referring_site: order.referrerUrl,
        cancelled_at: order.cancelledAt,
        cancel_reason: order.cancelReason,
        user_id: order.customer
          ? order.customer.id.replace("gid://shopify/Customer/", "")
          : null,
        name: order.name,
        fulfillment_status: null,
        sales_channel: order.publication !== null ? order.publication.name : "",
        shipping: order.totalShippingPriceSet.shopMoney.amount,
        shipping_tax:
          order.shippingLine !== null && order.shippingLine.taxLines.length > 0
            ? order.shippingLine.taxLines.priceSet.shopMoney.amount
            : 0,
        cancelled: order.cancelledAt !== null,
        shipping_costs: shippingCosts,
      };

      upsertItem(pg, "orders", "id", ordersData);

      for (let i = 0; i < order.refunds.length; i++) {
        let refund = order.refunds[i];
        refund.id = refund.id.replace("gid://shopify/Refund/", "");

        let refundsData = {
          id: refund.id,
          order_id: order.id,
          amount: refund.totalRefundedSet.shopMoney.amount,
          created_at: refund.createdAt,
        };

        upsertItem(pg, "refunds", "id", refundsData);
      }

      for (let i = 0; i < order.taxLines.length; i++) {
        let tax = order.taxLines[i];
        let taxesData = {
          order_id: order.id,
          price: tax.priceSet.shopMoney.amount,
          rate: tax.rate,
          title: tax.title,
        };

        upsertItem(pg, "taxes", [["order_id", "title"]], taxesData);
      }

      for (let i = 0; i < order.lineItems.length; i++) {
        let lineItem = order.lineItems[i];

        lineItem.id = lineItem.id.replace("gid://shopify/LineItem/", "");
        let lineItemsData = {
          id: lineItem.id,
          order_id: order.id,
          variant_id: lineItem.variant.id.replace(
            "gid://shopify/ProductVariant/",
            ""
          ),
          quantity: lineItem.quantity,
          sku: lineItem.sku,
          cost: lineItem.variant.inventoryItem.unitCost.amount,
          price: lineItem.originalUnitPriceSet.shopMoney.amount,
          price_with_discount: lineItem.discountedUnitPriceSet.shopMoney.amount,
          product_id: lineItem.product.id.replace("gid://shopify/Product/", ""),
          total_discount: lineItem.totalDiscountSet.shopMoney.amount,
          refunded: lineItem.quantity != lineItem.refundableQuantity,
        };

        upsertItem(pg, "line_items", "id", lineItemsData);
      }
    }
  },
  processOrders: async function (shopData, pg) {
    try {
      const client = await handlers.createClient(shopData.url, shopData.key);
      await client
        .mutate({ mutation: ordersBulkOperationMutation })
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

                  console.log("Starting products fetching");
                  const productsHandler = require("./products");
                  await productsHandler.processProducts(shopData, pg);

                  let orders = await self.getOrdersDataFromFile(
                    statusResponse.data.currentBulkOperation.url,
                    pg
                  );
                  await self.addOrdersToDb(orders, pg, shopData);
                } else if (statusResponse.data.currentBulkOperation.errorCode) {
                  console.log(
                    statusResponse.data.currentBulkOperation.errorCode
                  );
                  clearInterval(interval);
                } else {
                  console.log(
                    "Fetching status: " +
                      statusResponse.data.currentBulkOperation.status
                  );
                }
              });
          }, 30000);
        });
    } catch (e) {
      console.log(e);
      await pg("stores")
        .where("id", "=", shopData.id)
        .update({ processed: processingStatuses.error });
    }
  },
};
