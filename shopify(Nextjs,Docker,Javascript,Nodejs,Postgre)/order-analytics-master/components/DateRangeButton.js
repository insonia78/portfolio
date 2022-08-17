import React from "react";
import Button from "./Button";

class DateRangeButton extends React.Component {
  constructor(props) {
    super(props);

    this.clickHandler = this.clickHandler.bind(this);
  }

  clickHandler() {
    this.props.setFrom(this.props.from);
    this.props.setTo(this.props.to);
  }

  render() {
    return (
      <div>
        <Button
          onClick={this.clickHandler}
          title={this.props.title}
          type="primary"
        />
      </div>
    );
  }
}

export default DateRangeButton;
