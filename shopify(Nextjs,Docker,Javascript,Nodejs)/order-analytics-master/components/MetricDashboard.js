import React from "react";
import { Layout } from "@shopify/polaris";
import MetricCard from "./MetricCard";

class MetricDashboard extends React.Component {
  render() {
    return (
      <div className="d-flex bg-lighter mb-9 align-self-start">
        <Layout>
          <MetricCard
            title="Number of orders"
            endpoint="orders-count"
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Revenue"
            endpoint="revenue"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="COGS"
            endpoint="cogs"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Discounts"
            endpoint="discounts"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Shipping cost"
            endpoint="shipping-cost"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Shipping charged"
            endpoint="shipping-charged"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Gross margin"
            endpoint="gross-margin"
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Gross profit"
            endpoint="gross-profit"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Taxes"
            endpoint="taxes"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Transaction fee"
            endpoint="transaction-fee"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Handling fee"
            endpoint="handling-fee"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Refunds"
            endpoint="refunds"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Avg. order value"
            endpoint="avg-orders"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Avg. order profit"
            endpoint="avg-order-profit"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard
            title="Lifetime customer value (LTV)"
            endpoint="lifetime-customer-value"
            showCurrencySign={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
          <MetricCard title="LTV.CAC" />
        </Layout>
      </div>
    );
  }
}

export default MetricDashboard;
