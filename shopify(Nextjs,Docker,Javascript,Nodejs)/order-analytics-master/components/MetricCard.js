import React from "react";
import { TextStyle, Card, DisplayText } from "@shopify/polaris";
import Cookies from "js-cookie";
import getCurrencySymbol from "currency-symbols";

class MetricCard extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      value: 0,
      currencySymbol: "$",
    };

    this.updateDashboardData = this.updateDashboardData.bind(this);
  }

  componentDidMount() {
    let currency = Cookies.get("shopCurrency");
    if (currency !== undefined) {
      this.setState({ currencySymbol: getCurrencySymbol(currency) });
    }

    this.updateDashboardData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.fromDate !== prevProps.fromDate ||
      this.props.toDate !== prevProps.toDate
    ) {
      this.updateDashboardData();
    }
  }

  updateDashboardData() {
    let params = "";
    if (this.props.fromDate) {
      params = "?fromDate=" + encodeURIComponent(this.props.fromDate);
      if (this.props.toDate) {
        params = params + "&toDate=" + encodeURIComponent(this.props.toDate);
      }
    } else if (this.props.toDate) {
      params = "?toDate=" + encodeURIComponent(this.props.toDate);
    }

    fetch("/api/v1/dashboard-data/" + this.props.endpoint + params, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((json) => this.setState({ value: json.data }));
  }

  render() {
    return (
      <div style={{ width: "24%", padding: "0.5%" }}>
        <Card>
          <div
            style={{
              textAlign: "center",
              paddingTop: "20px",
              paddingBottom: "10px",
            }}
          >
            <TextStyle variation="subdued">
              {this.props.title.toUpperCase()}
            </TextStyle>
          </div>
          <div style={{ textAlign: "center", paddingBottom: "20px" }}>
            <DisplayText size="extraLarge">
              {this.props.showCurrencySign ? this.state.currencySymbol : ""}
              {this.state.value}
              {this.props.showPercentSign ? "%" : ""}
            </DisplayText>
          </div>
        </Card>
      </div>
    );
  }
}

export default MetricCard;
