import React from "react";

class ChartS3 extends React.Component {
  render() {
    return new Chart(selectCanvas, {
      type: "bar",
      data: {
        labels: _get_data.labels,
        datasets: chart_data,
      },
      options: {
        legend: {
          display: _get_data.legend ? _get_data.legend : false,
          rtl: NioApp.State.isRTL,
          labels: {
            boxWidth: 30,
            padding: 20,
            fontColor: "#6783b8",
          },
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          rtl: NioApp.State.isRTL,
          callbacks: {
            title: function title(tooltipItem, data) {
              return data.datasets[tooltipItem[0].datasetIndex].label;
            },
            label: function label(tooltipItem, data) {
              return (
                data.datasets[tooltipItem.datasetIndex]["data"][
                  tooltipItem["index"]
                ] +
                " " +
                _get_data.dataUnit
              );
            },
          },
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: true,
              stacked: _get_data.stacked ? _get_data.stacked : false,
              position: NioApp.State.isRTL ? "right" : "left",
              ticks: {
                beginAtZero: true,
                fontSize: 12,
                fontColor: "#9eaecf",
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
              display: true,
              stacked: _get_data.stacked ? _get_data.stacked : false,
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                reverse: NioApp.State.isRTL,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 10,
                zeroLineColor: "transparent",
              },
            },
          ],
        },
      },
    });
  }
}

export default ChartS3;
