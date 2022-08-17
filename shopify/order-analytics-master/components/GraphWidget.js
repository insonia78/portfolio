import React from "react";
import { Line } from "react-chartjs-2";
import Button from "./Button";

class GraphWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstAmount: "",
      secondAmount: "",
      showCurrency: true,
      dataForCharts: [],
    };

    this.updateData = this.updateData.bind(this);
    this.renderButton = this.renderButton.bind(this);
  }

  componentDidMount() {
    if (this.props.showCurrency !== undefined) {
      this.setState({
        showCurrency: this.props.showCurrency,
      });
    }

    this.updateData();
  }

  componentDidUpdate(prevProps) {
    if (
      this.props.fromDate !== prevProps.fromDate ||
      this.props.toDate !== prevProps.toDate
    ) {
      this.updateData();
    }
  }

  updateData() {
    let params = "";
    if (this.props.fromDate) {
      params = "?fromDate=" + encodeURIComponent(this.props.fromDate);
      if (this.props.toDate) {
        params = params + "&toDate=" + encodeURIComponent(this.props.toDate);
      }
    } else if (this.props.toDate) {
      params = "?toDate=" + encodeURIComponent(this.props.toDate);
    }

    this.setState({ dataForCharts: [] });

    this.props.dataEndpoints.map((endpointData) => {
      fetch(endpointData.endpoint + params, {
        method: "GET",
      })
        .then((result) => result.json())
        .then((json) => {
          let dataForCharts = this.state.dataForCharts;
          dataForCharts.push({
            labels: json.data,
            dataUnit: endpointData.dataUnit,
            lineColor:
              endpointData.lineColor !== undefined
                ? endpointData.lineColor
                : "",
            lineTension: 0.3,
            datasets: [
              {
                label: endpointData.label,
                color:
                  endpointData.lineColor !== undefined
                    ? endpointData.lineColor
                    : this.props.isDark
                    ? "#9d72ff"
                    : "#7de1f8",
                background:
                  endpointData.backgroundColor !== undefined
                    ? endpointData.backgroundColor
                    : this.props.isDark
                    ? "rgba(157,114,255, 0.25)"
                    : "rgba(125, 225, 248, 0.25)",
                data: json.data,
              },
            ],
          });
          this.setState({
            dataForCharts: dataForCharts,
          });
        });
    });

    if (this.props.firstAmountEndpoint !== undefined) {
      fetch(this.props.firstAmountEndpoint + params, { method: "GET" })
        .then((result) => result.json())
        .then((json) => this.setState({ firstAmount: json.data }));
    }

    if (this.props.secondAmountEndpoint !== undefined) {
      fetch(this.props.secondAmountEndpoint + params, { method: "GET" })
        .then((result) => result.json())
        .then((json) => this.setState({ secondAmount: json.data }));
    }
  }

  renderButton() {
    if (this.props.buttonAction !== undefined) {
      return (
        <Button
          type="info"
          onClick={this.props.buttonAction}
          title="Pie chart"
        />
      );
    }

    return "";
  }

  renderFirstValue() {
    let title = "";
    let amount = "";
    if (
      this.props.firstAmountEndpoint !== undefined &&
      this.props.firstTitle !== undefined
    ) {
      title = <h6 className="title">{this.props.firstTitle}</h6>;
      amount = (this.state.showCurrency ? "$" : "") + this.state.firstAmount;
    }
    return (
      <div>
        <div className="card-title-group">
          <div className="card-title">{title}</div>
          {this.renderButton()}
        </div>
        <div className="data">
          <div className="amount">{amount}</div>
        </div>
      </div>
    );
  }

  renderSecondValue() {
    if (
      this.props.secondAmountEndpoint !== undefined &&
      this.props.secondTitle !== undefined
    ) {
      return (
        <div className="data">
          <h6 className="sub-title">{this.props.secondTitle}</h6>
          <div className="data-group">
            <div className="amount">
              {this.state.showCurrency ? "$" : ""}
              {this.state.secondAmount}
            </div>
            <div className="info text-right">
              <span className="change up text-danger">
                <em className="icon ni ni-arrow-long-up"></em>4.63%
              </span>
              <br />
              <span>vs. last week</span>
            </div>
          </div>
        </div>
      );
    }

    return "";
  }

  prepareData() {
    let datasets = [];
    for (let j = 0; j < this.state.dataForCharts.length; j++) {
      let dataForChart = this.state.dataForCharts[j];

      for (var i = 0; i < dataForChart.datasets.length; i++) {
        datasets.push({
          label: dataForChart.datasets[i].label,
          lineTension: dataForChart.lineTension,
          backgroundColor: dataForChart.datasets[i].background,
          borderColor: dataForChart.datasets[i].color,
          pointBorderColor: "transparent",
          pointBackgroundColor: "transparent",
          pointHoverBackgroundColor: "#fff",
          pointHoverBorderColor: dataForChart.datasets[i].color,
          pointBorderWidth: 2,
          pointHoverRadius: 4,
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 4,
          dataUnit: dataForChart.dataUnit,
          data: dataForChart.datasets[i].data,
        });
      }
    }

    return datasets;
  }

  render() {
    let self = this;
    let data = this.prepareData();
    let labels =
      this.state.dataForCharts[0] !== undefined
        ? this.state.dataForCharts[0].labels
        : [];

    return (
      <div className="col-xxl-4 col-md-6">
        <div
          className={"card" + (this.props.isDark ? " is-dark" : "") + " h-100"}
        >
          <div className="nk-ecwg nk-ecwg1">
            <div className="card-inner">
              {this.renderFirstValue()}

              {this.renderSecondValue()}
            </div>
            <div className="nk-ecwg2-ck">
              <Line
                data={{
                  labels: labels,
                  datasets: data,
                }}
                options={{
                  legend: {
                    display:
                      this.props.displayLabel === undefined
                        ? false
                        : this.props.displayLabel,
                    labels: {
                      // boxWidth: 12,
                      // padding: 20,
                      fontColor: "#6783b8",
                    },
                  },
                  maintainAspectRatio: false,
                  tooltips: {
                    enabled: true,
                    callbacks: {
                      title: function title(tooltipItem, data) {
                        return data["labels"][tooltipItem[0]["index"]];
                      },
                      label: function label(tooltipItem, data) {
                        return (
                          data.datasets[tooltipItem.datasetIndex]["data"][
                            tooltipItem["index"]
                          ] +
                          " " +
                          data.datasets[tooltipItem.datasetIndex].dataUnit
                        );
                      },
                    },
                    backgroundColor: "#1c2b46",
                    titleFontSize: 10,
                    titleFontColor: "#fff",
                    titleMarginBottom: 4,
                    bodyFontColor: "#fff",
                    bodyFontSize: 10,
                    bodySpacing: 4,
                    yPadding: 6,
                    xPadding: 6,
                    footerMarginTop: 0,
                    displayColors: false,
                  },
                  scales: {
                    yAxes: [
                      {
                        display: false,
                        ticks: {
                          beginAtZero: true,
                          fontSize: 12,
                          fontColor: "#9eaecf",
                          padding: 0,
                        },
                        gridLines: {
                          color: "#e5ecf8",
                          tickMarkLength: 0,
                          zeroLineColor: "#e5ecf8",
                        },
                      },
                    ],
                    xAxes: [
                      {
                        display: false,
                        ticks: {
                          fontSize: 12,
                          fontColor: "#9eaecf",
                          source: "auto",
                          padding: 0,
                        },
                        gridLines: {
                          color: "transparent",
                          tickMarkLength: 0,
                          zeroLineColor: "#e5ecf8",
                          offsetGridLines: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default GraphWidget;
