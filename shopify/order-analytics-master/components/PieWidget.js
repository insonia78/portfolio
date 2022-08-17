import React from "react";
import { Pie } from "react-chartjs-2";
import Button from "./Button";

class PieWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      dataForCharts: [],
    };

    this.updateData = this.updateData.bind(this);
  }

  componentDidMount() {
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
          const randomColor = require("randomcolor");
          dataForCharts.push({
            labels: Object.keys(json.data),
            dataUnit: endpointData.dataUnit,
            datasets: [
              {
                data: json.data,
                background: randomColor({
                  count: Object.keys(json.data).length,
                  hue: "random",
                }),
                color: "#fff",
              },
            ],
          });
          this.setState({
            dataForCharts: dataForCharts,
          });
        });
    });
  }

  prepareData() {
    let datasets = [];
    for (let j = 0; j < this.state.dataForCharts.length; j++) {
      let dataForChart = this.state.dataForCharts[j];

      for (var i = 0; i < dataForChart.datasets.length; i++) {
        datasets.push({
          dataUnit: dataForChart.dataUnit,
          backgroundColor: dataForChart.datasets[i].background,
          borderWidth: 2,
          borderColor: dataForChart.datasets[i].color,
          hoverBorderColor: dataForChart.datasets[i].color,
          data: Object.values(dataForChart.datasets[i].data),
        });
      }
    }

    return datasets;
  }

  renderFirstValue() {
    if (this.props.firstTitle !== undefined) {
      return (
        <div className="card-inner h-100 stretch flex-column">
          <div className="card-title-group">
            <div className="card-title card-title-sm">
              <h6 className="title">{this.props.firstTitle}</h6>
            </div>
            <div className="card-title card-title-sm">
              <Button
                type="info"
                onClick={this.props.buttonAction}
                title="Line chart"
              />
            </div>
          </div>
        </div>
      );
    }
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
        <div className="card h-100">
          {this.renderFirstValue()}
          <div className="device-status-ck">
            <Pie
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
                    boxWidth: 12,
                    padding: 20,
                    fontColor: "#6783b8",
                  },
                },
                rotation: -1.5,
                cutoutPercentage: 70,
                maintainAspectRatio: false,
                tooltips: {
                  enabled: true,
                  callbacks: {
                    title: function (tooltipItem, data) {
                      return data["labels"][tooltipItem[0]["index"]];
                    },
                    label: function (tooltipItem, data) {
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
                  titleFontSize: 13,
                  titleFontColor: "#fff",
                  titleMarginBottom: 6,
                  bodyFontColor: "#fff",
                  bodyFontSize: 12,
                  bodySpacing: 4,
                  yPadding: 10,
                  xPadding: 10,
                  footerMarginTop: 0,
                  displayColors: false,
                },
              }}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default PieWidget;
