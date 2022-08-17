import React from "react";
import DatePicker from "./DatePicker";
import Moment from "moment";
import Button from "./Button";

class Dropdown extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      currentItem: this.props.items[0],
    };

    this.changeHandler = this.changeHandler.bind(this);
    this.renderDatePickers = this.renderDatePickers.bind(this);
  }

  changeHandler(itemData) {
    this.props.setFrom(itemData.from);
    this.props.setTo(itemData.to);

    this.setState({
      currentItem: itemData,
    });
  }

  renderDatePickers() {
    if (this.state.currentItem.showDatePickers) {
      return (
        <span>
          {this.props.datepicker1}
          {this.props.datepicker2}

          <div
            className="form-group"
            style={{ display: "inline-block", marginLeft: "10px" }}
          >
            <Button
              onClick={this.props.applyCustomDate}
              type="primary"
              title="Apply"
            />
          </div>
        </span>
      );
    }

    return null;
  }

  render() {
    return (
      <div className="drodown">
        <a
          href="#"
          className="dropdown-toggle btn btn-white btn-dim btn-outline-light"
          data-toggle="dropdown"
        >
          <em className="d-none d-sm-inline icon ni ni-filter-fill" />
          <span>{this.state.currentItem.title}</span>
          <em className="dd-indc icon ni ni-chevron-right" />
        </a>
        <div className="dropdown-menu dropdown-menu-right">
          <ul className="link-list-opt no-bdr">
            {this.props.items.map((itemData, index) => {
              return (
                <li onClick={() => this.changeHandler(itemData)} key={index}>
                  <a href="#">
                    <span>{itemData.title}</span>
                  </a>
                </li>
              );
            })}
          </ul>
        </div>

        {this.renderDatePickers()}
      </div>
    );
  }
}

export default Dropdown;
