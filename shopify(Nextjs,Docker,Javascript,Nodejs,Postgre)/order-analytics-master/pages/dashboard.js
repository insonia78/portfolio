import React from "react";
import Moment from "moment";
import DatePicker from "../components/DatePicker";
import Dropdown from "../components/Dropdown";
import MetricDashboard from "../components/MetricDashboard";
import WidgetsDashboard from "../components/WidgetsDashboard";

class Dashboard extends React.Component {
  constructor(params) {
    super(params);

    let today = Moment();

    this.state = {
      fromDate: today.format("YYYY-MM-DD"),
      toDate: today.format("YYYY-MM-DD"),
    };

    this.applyCustomDate = this.applyCustomDate.bind(this);
    this.setFrom = this.setFrom.bind(this);
    this.setTo = this.setTo.bind(this);
  }

  setFrom(from) {
    this.setState({
      fromDate: from,
    });
  }

  setTo(to) {
    this.setState({
      toDate: to,
    });
  }

  applyCustomDate() {
    this.setState({
      fromDate: document.getElementById("from-date-picker").value,
      toDate: document.getElementById("to-date-picker").value,
    });
  }

  render() {
    let yesterday = new Date();
    let today = Moment();
    let startOfWeek = Moment();
    let startOfMonth = Moment();
    let startOfYear = Moment();
    let startOfLastWeek = Moment();
    let endOfLastWeek = Moment();
    let startOfLastMonth = Moment();
    let endOfLastMonth = Moment();
    let startOfLastYear = Moment();
    let endOfLastYear = Moment();
    startOfWeek.startOf("isoWeek");
    startOfMonth.startOf("month");
    startOfYear.startOf("year");
    startOfLastWeek.subtract(1, "week").startOf("isoWeek");
    endOfLastWeek.subtract(1, "week").endOf("isoWeek");
    startOfLastMonth.subtract(1, "month").startOf("month");
    endOfLastMonth.subtract(1, "month").endOf("month");
    startOfLastYear.subtract(1, "year").startOf("year");
    endOfLastYear.subtract(1, "year").endOf("year");
    yesterday.setDate(yesterday.getDay() - 1);

    return (
      <div>
        <div className="d-flex">
          <Dropdown
            items={[
              {
                title: "Today (Default)",
                from: today.format("YYYY-MM-DD"),
                to: today.format("YYYY-MM-DD"),
              },
              {
                title: "Week-to-Date",
                from: startOfWeek.format("YYYY-MM-DD"),
                to: today.format("YYYY-MM-DD"),
              },
              {
                title: "Month-to-Date",
                from: startOfMonth.format("YYYY-MM-DD"),
                to: today.format("YYYY-MM-DD"),
              },
              {
                title: "Last Week",
                from: startOfLastWeek.format("YYYY-MM-DD"),
                to: endOfLastWeek.format("YYYY-MM-DD"),
              },
              {
                title: "Last Month",
                from: startOfLastMonth.format("YYYY-MM-DD"),
                to: endOfLastMonth.format("YYYY-MM-DD"),
              },
              {
                title: "Year-to-Date",
                from: startOfYear.format("YYYY-MM-DD"),
                to: today.format("YYYY-MM-DD"),
              },
              {
                title: "Last Year",
                from: startOfLastYear.format("YYYY-MM-DD"),
                to: endOfLastYear.format("YYYY-MM-DD"),
              },
              { title: "All Time", from: false, to: false },
              {
                title: "Custom",
                showDatePickers: true,
              },
            ]}
            setFrom={this.setFrom}
            setTo={this.setTo}
            datepicker1={
              <DatePicker
                value={Moment(yesterday).format("YYYY-MM-DD")}
                id="from-date-picker"
              />
            }
            datepicker2={
              <DatePicker
                value={today.format("YYYY-MM-DD")}
                id="to-date-picker"
              />
            }
            applyCustomDate={this.applyCustomDate}
          />
        </div>
        <div style={{ marginTop: "35px" }} className="d-flex">
          <MetricDashboard
            fromDate={this.state.fromDate}
            toDate={this.state.toDate}
          />
        </div>

        <WidgetsDashboard
          fromDate={this.state.fromDate}
          toDate={this.state.toDate}
        />
      </div>
    );
  }
}

export default Dashboard;
