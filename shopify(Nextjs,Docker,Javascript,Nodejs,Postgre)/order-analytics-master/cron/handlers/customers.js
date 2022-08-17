import * as handlers from "../../server/handlers";
import { gql } from "apollo-boost";
import processingStatuses from "../../processingStatuses";
import upsertItem from "../../upsert";

const customersBulkOperationMutation = gql`
  mutation {
    bulkOperationRunQuery(
      query: """
          {
      customers {
          edges {
            node {
              id
              email
              firstName
              lastName
              createdAt
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
  getCustomersDataFromFile: async function (file) {
    let customersResult = [];
    await fetch(file, { method: "GET" })
      .then((data) => data.text())
      .then((data) => {
        let lines = data.split(/\r?\n/);
        for (let i = 0; i < lines.length; i++) {
          if (lines[i].trim() === "") {
            continue;
          }

          let obj = JSON.parse(lines[i]);
          customersResult.push(obj);
        }
      });

    return customersResult;
  },
  addCustomersToDb: async function (customers, pg, shopData) {
    for (let key in customers) {
      let customer = customers[key];

      customer.id = customer.id.replace("gid://shopify/Customer/", "");
      let customersData = {
        id: customer.id,
        store_id: shopData.id,
        email: customer.email,
        first_name: customer.firstName,
        last_name: customer.lastName,
        created_at: customer.createdAt,
      };

      upsertItem(pg, "customers", "id", customersData);
    }
  },
  processCustomers: async function (shopData, pg) {
    try {
      const client = await handlers.createClient(shopData.url, shopData.key);
      await client
        .mutate({ mutation: customersBulkOperationMutation })
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

                  let customers = await self.getCustomersDataFromFile(
                    statusResponse.data.currentBulkOperation.url,
                    pg
                  );

                  console.log("Customers");
                  console.log(customers);

                  await self.addCustomersToDb(customers, pg, shopData);
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
