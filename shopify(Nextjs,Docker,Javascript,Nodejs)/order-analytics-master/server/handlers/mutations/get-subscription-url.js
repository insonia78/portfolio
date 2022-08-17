import "isomorphic-fetch";
import { gql } from "apollo-boost";
import Moment from "moment";
import * as handlers from "../../handlers/index";

export function RECURRING_CREATE(url, data) {
  return gql`
    mutation {
      appSubscriptionCreate(
          name: "Order Analytics: ${data.text}"
          returnUrl: "${url}"
          test: true
          trialDays: 30
          lineItems: [
          {
            plan: {
              appRecurringPricingDetails: {
                  price: { amount: ${data.cost}, currencyCode: USD }
              }
            }
          }
          ]
        ) {
            userErrors {
              field
              message
            }
            confirmationUrl
            appSubscription {
              id
            }
        }
    }`;
}

function getDataByRevenue(revenue) {
  const prices = [
    {
      revenue: 4000000,
      cost: 1000,
      text: ">$4mm / month. Please contact contact@orderanalytics.app",
    },
    { revenue: 3000000, cost: 699, text: "$3mm to $4mm USD / month" },
    { revenue: 2000000, cost: 549, text: "$2mm to $3mm USD / month\t" },
    { revenue: 1000000, cost: 449, text: "$1mm to $2mm USD / month" },
    { revenue: 500000, cost: 349, text: "$500,001 to $1mm USD / month" },
    { revenue: 300000, cost: 249, text: "$300,001 to $500,000 USD / month" },
    { revenue: 150000, cost: 149, text: "$150,001 to $300,000 USD / month" },
    { revenue: 80000, cost: 99, text: "$80,001 to $150,000 USD / month" },
    { revenue: 10000, cost: 49, text: "$10,001 to $80,000 USD / month" },
    { revenue: -1, cost: 9.99, text: "up to $10,000 USD / month" },
  ];

  for (let i = 0; i < prices.length; i++) {
    if (revenue > prices[i].revenue) {
      return prices[i];
    }
  }

  return prices[0];
}

async function isAppHavePricePlan(client) {
  const gqlQuery = gql`
    query {
      currentAppInstallation {
        allSubscriptions(first: 2) {
          edges {
            node {
              lineItems {
                id
              }
              createdAt
              id
              name
              status
              test
            }
          }
        }
      }
    }
  `;

  return await client.query({ query: gqlQuery }).then((response) => {
    for (let edge of response.data.currentAppInstallation.allSubscriptions
      .edges) {
      if (edge.node.status !== "CANCELLED") {
        return true;
      }
    }

    return false;
  });
}

export const getSubscriptionUrl = async (ctx, shop, accessToken) => {
  const { client } = ctx;

  let confirmationUrl = "/";

  if (!(await isAppHavePricePlan(client))) {
    const apiUtils = new handlers.apiUtils(shop, accessToken);
    const startOfLastMonth = Moment();
    const endOfLastMonth = Moment();
    startOfLastMonth.subtract(4, "month").startOf("month");
    endOfLastMonth.subtract(1, "month").endOf("month");

    confirmationUrl = await client
      .mutate({
        mutation: RECURRING_CREATE(
          process.env.HOST,
          getDataByRevenue(
            (await apiUtils.getOrderTotalsByPeriod(
              startOfLastMonth,
              endOfLastMonth
            )) / 3
          )
        ),
      })
      .then((response) => response.data.appSubscriptionCreate.confirmationUrl);
  }

  return ctx.redirect(confirmationUrl);
};
