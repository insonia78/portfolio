import React from "react";

class DatePicker extends React.Component {
  constructor(props) {
    super(props);

    this.renderLabel = this.renderLabel.bind(this);
  }

  renderLabel() {
    if (this.props.label) {
      return <label className="form-label">{this.props.label}</label>;
    }

    return null;
  }

  componentDidMount() {
    const s = document.createElement("script");
    s.type = "text/javascript";
    s.async = true;
    s.innerHTML = 'NioApp.Picker.date(".date-picker");';
    this.instance.appendChild(s);
  }

  render() {
    return (
      <div
        className="form-group"
        style={{ display: "inline-block", marginLeft: "10px" }}
        ref={(el) => (this.instance = el)}
      >
        {this.renderLabel()}
        <div className="form-control-wrap">
          <div className="form-icon form-icon-left">
            <em className="icon ni ni-calendar"></em>
          </div>
          <input
            type="text"
            style={{ minWidth: "135px" }}
            id={this.props.id}
            className="form-control date-picker"
            data-date-format="yyyy-mm-dd"
            defaultValue={this.props.value}
          />
        </div>
      </div>
    );
  }
}

export default DatePicker;
