import React from "react";
import Table from "./Table";

class TableWidget extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
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

    fetch(this.props.endpoint + params, {
      method: "GET",
    })
      .then((result) => result.json())
      .then((json) => {
        this.setState({
          data: json.data,
        });
      });
  }

  render() {
    let fieldsToDisplay = [];

    if (this.state.data[0] !== undefined) {
      fieldsToDisplay = Object.keys(this.state.data[0]);
    }

    return (
      <div className="col-xxl-4 col-md-6">
        <div
          className={"card" + (this.props.isDark ? " is-dark" : "") + " h-100"}
        >
          <Table
            header={this.props.header}
            data={this.state.data}
            fieldsToDisplay={fieldsToDisplay}
          />
        </div>
      </div>
    );
  }
}

export default TableWidget;
