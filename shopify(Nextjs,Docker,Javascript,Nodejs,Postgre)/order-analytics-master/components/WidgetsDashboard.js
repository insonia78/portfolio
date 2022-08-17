import React from "react";
import GraphWidget from "./GraphWidget";
import TableWidget from "./TableWidget";
import PieWidget from "./PieWidget";

class WidgetsDashboard extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      revenueChartLine: false,
      revenueDataEndpoints: [],
      expencesChartLine: false,
      expencesDataEndpoints: [],
    };

    this.renderRevenueChart = this.renderRevenueChart.bind(this);
    this.prepareParams = this.prepareParams.bind(this);
    this.handleRevenueToggleButton = this.handleRevenueToggleButton.bind(this);
    this.fetchDataForRevenueLineChart = this.fetchDataForRevenueLineChart.bind(
      this
    );
  }

  handleRevenueToggleButton() {
    this.setState({
      revenueChartLine: !this.state.revenueChartLine,
    });
  }

  componentDidMount() {
    this.fetchDataForRevenueLineChart();
  }

  componentDidUpdate(prevProps) {
    console.log("Did update");
    if (
      this.props.fromDate !== prevProps.fromDate ||
      this.props.toDate !== prevProps.toDate
    ) {
      this.fetchDataForRevenueLineChart();
    }
  }

  renderRevenueChart() {
    if (!this.state.revenueChartLine) {
      return (
        <PieWidget
          dataEndpoints={[
            {
              endpoint: "/api/v1/dashboard-data/revenue-by-channels",
              dataUnit: "Dollars",
            },
          ]}
          firstTitle="Revenue"
          displayLabel={true}
          fromDate={this.props.fromDate}
          toDate={this.props.toDate}
          buttonAction={this.handleRevenueToggleButton}
        />
      );
    } else {
      return (
        <GraphWidget
          dataEndpoints={this.state.revenueDataEndpoints}
          buttonAction={this.handleRevenueToggleButton}
          displayLabel={true}
          fromDate={this.props.fromDate}
          toDate={this.props.toDate}
        />
      );
    }
  }

  prepareParams() {
    let params = "";
    if (this.props.fromDate) {
      params = "?fromDate=" + encodeURIComponent(this.props.fromDate);
      if (this.props.toDate) {
        params = params + "&toDate=" + encodeURIComponent(this.props.toDate);
      }
    } else if (this.props.toDate) {
      params = "?toDate=" + encodeURIComponent(this.props.toDate);
    }

    return params;
  }

  async fetchDataForRevenueLineChart() {
    let params = this.prepareParams();

    await fetch("/api/v1/dashboard-data/revenue-by-channels" + params, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((json) => {
        console.log("json.data");
        console.log(json.data);
        let channels = Object.keys(json.data);
        console.log("channels");
        console.log(channels);
        let result = [];

        for (let channel of channels) {
          result.push({
            endpoint:
              "/api/v1/dashboard-data/revenue-by-channel-by-months?channel=" +
              encodeURIComponent(channel),
            dataUnit: "Dollars",
            label: channel,
          });
        }

        this.setState({
          revenueDataEndpoints: result,
        });
      });
  }

  render() {
    return (
      <div>
        <div className="row g-gs">
          {/*FIRST ROW*/}
          <GraphWidget
            dataEndpoints={[
              {
                endpoint: "/api/v1/dashboard-data/profit-by-months",
                dataUnit: "Dollars",
              },
            ]}
            firstAmountEndpoint="/api/v1/dashboard-data/revenue"
            secondAmountEndpoint="/api/v1/dashboard-data/net-profit"
            firstTitle="Total"
            secondTitle="Net Profit"
            isDark={true}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />

          <GraphWidget
            dataEndpoints={[
              {
                endpoint:
                  "/api/v1/dashboard-data/lifetime-customer-value-months",
                dataUnit: "Dollars",
              },
            ]}
            firstAmountEndpoint="/api/v1/dashboard-data/lifetime-customer-value"
            firstTitle="LTV"
            isDark={false}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />

          <GraphWidget
            dataEndpoints={[
              {
                endpoint: "/api/v1/dashboard-data/orders-count-months",
                dataUnit: "Orders",
              },
            ]}
            firstAmountEndpoint="/api/v1/dashboard-data/orders-count"
            firstTitle="New orders"
            isDark={false}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
            showCurrency={false}
          />
        </div>

        <div className="row g-gs">
          {/*SECOND ROW*/}
          <GraphWidget
            dataEndpoints={[
              {
                endpoint: "/api/v1/dashboard-data/adspend-total-by-months",
                dataUnit: "Dollars",
                label: "Total Adspend",
              },
              {
                endpoint: "/api/v1/dashboard-data/adspend-average-by-months",
                dataUnit: "Dollars",
                label: "Average Adspend",
                backgroundColor: "#d46c6c",
                lineColor: "#d01010",
              },
            ]}
            firstAmountEndpoint="/api/v1/dashboard-data/adspend"
            secondAmountEndpoint="/api/v1/dashboard-data/adspend-per-order"
            firstTitle="Adspend"
            secondTitle="Adspend Per Order"
            displayLabel={true}
            isDark={false}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />

          <GraphWidget
            dataEndpoints={[
              {
                endpoint: "/api/v1/dashboard-data/average-order-price-months",
                dataUnit: "Dollars",
                label: "Average order value month",
              },
              {
                endpoint: "/api/v1/dashboard-data/average-order-profit-months",
                dataUnit: "Dollars",
                label: "Average order profit month",
                backgroundColor: "#d46c6c",
                lineColor: "#d01010",
              },
            ]}
            displayLabel={true}
            isDark={false}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />

          <GraphWidget
            dataEndpoints={[
              {
                endpoint: "/api/v1/dashboard-data/customers-count-months",
                dataUnit: "Orders",
              },
            ]}
            firstAmountEndpoint="/api/v1/dashboard-data/customers-count"
            firstTitle="New customers"
            isDark={false}
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
            showCurrency={false}
          />
        </div>
        <div className="row g-gs">
          {/*THIRD ROW*/}
          {this.renderRevenueChart()}

          <TableWidget
            header={[{ title: "Campaign name" }, { title: "Spends" }]}
            endpoint="/api/v1/dashboard-data/campaigns-table"
            fromDate={this.props.fromDate}
            toDate={this.props.toDate}
          />
        </div>
      </div>
    );
  }
}

export default WidgetsDashboard;
