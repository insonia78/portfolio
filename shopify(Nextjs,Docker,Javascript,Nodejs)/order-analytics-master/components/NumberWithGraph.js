import React from "react";

import { Line } from "react-chartjs-2";
import Moment from "moment";

class NumberWithGraph extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      number: "",
      dataForChart: { datasets: [], labels: [] },
    };

    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    this.fetchData();

    setInterval(this.fetchData, 600000);
  }

  fetchData() {
    fetch(this.props.endpoint, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((json) => {
        this.setState({
          dataForChart: {
            labels: json.data,
            dataUnit: this.props.dataUnit,
            lineTension: 0.3,
            datasets: [
              {
                label: "",
                color: "#33d895",
                background: "transparent",
                data: json.data,
              },
            ],
          },
          number: json.data[json.data.length - 1],
        });

        if (this.props.setLastSynced !== undefined) {
          let now = Moment();
          this.props.setLastSynced(now.format("DD/MM/YYYY hh:mmA"));
        }
      });
  }

  prepareData(dataForChart) {
    let datasets = [];

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
        data: dataForChart.datasets[i].data,
      });
    }

    return datasets;
  }

  render() {
    let self = this;
    let datasets = this.prepareData(this.state.dataForChart);
    return (
      <div>
        <div className="nk-ecwg nk-ecwg6">
          <div className="card-inner" style={{ padding: "0.8rem" }}>
            <div className="card-title-group">
              <div className="card-title">
                <h6 className="title" style={{ fontSize: "0.8rem" }}>
                  {this.props.title}
                </h6>
              </div>
            </div>
            <div className="data" style={{ marginTop: "0.2rem" }}>
              <div className="data-group">
                <div className="amount" style={{ fontSize: "1.3rem" }}>
                  ${this.state.number}
                </div>
                <div className="nk-ecwg6-ck">
                  <Line
                    data={{
                      labels: this.state.dataForChart.labels,
                      datasets: datasets,
                    }}
                    options={{
                      legend: {
                        display: false,
                        labels: {
                          boxWidth: 12,
                          padding: 20,
                          fontColor: "#6783b8",
                        },
                      },
                      maintainAspectRatio: false,
                      tooltips: {
                        enabled: true,
                        callbacks: {
                          title: function title(tooltipItem, data) {
                            return false;
                          },
                          label: function label(tooltipItem, data) {
                            return (
                              datasets[tooltipItem.datasetIndex]["data"][
                                tooltipItem["index"]
                              ] +
                              " " +
                              self.props.dataUnit
                            );
                          },
                        },
                        backgroundColor: "#1c2b46",
                        titleFontSize: 8,
                        titleFontColor: "#fff",
                        titleMarginBottom: 4,
                        bodyFontColor: "#fff",
                        bodyFontSize: 8,
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
                              beginAtZero: false,
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
        </div>
      </div>
    );
  }
}

export default NumberWithGraph;
