import React from "react";
import { TextField } from "@shopify/polaris";
import Cookies from "js-cookie";

const WAIT_INTERVAL = 1000;

class VariantRow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      row: {},
      variantsOpen: false,
      currency: Cookies.get("shopCurrency"),
      handling: this.props.row.handling_fee.value,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  componentWillMount() {
    this.timer = null;
  }

  handleInputChange(value, id) {
    if (value === "" || /^[0-9\.]+$/.test(value)) {
      this.setState({ handling: value });

      clearTimeout(this.timer);
      let self = this;
      this.timer = setTimeout(function () {
        fetch(
          "/api/v1/data-settings/products/save-handling/" +
            id +
            "?handling=" +
            encodeURIComponent(value)
        ).then(() => self.props.showMessage("Saved"));
      }, WAIT_INTERVAL);
    }
  }

  render() {
    return (
      <div className="nk-tb-item bg-lighter" hidden={this.props.hidden}>
        <div className="nk-tb-col" />
        {this.props.fieldsToDisplay.map((field, key) => {
          if (this.props.row[field] === undefined) {
            return false;
          }

          let row = this.props.row[field];
          let value = row.value;
          let tdClasses = "nk-tb-col text-center";

          if (
            this.props.inputFields &&
            this.props.inputFields.includes(field)
          ) {
            tdClasses = tdClasses + " input-field";
            value = (
              <span className="table-input">
                <TextField
                  value={this.state.handling}
                  label=""
                  onChange={this.handleInputChange}
                  labelHidden={true}
                  id={row.id.value}
                />
              </span>
            );
          }

          return (
            <div className={tdClasses} key={key}>
              <span className={isNaN(row.value) ? "tb-sub" : "tb-amount"}>
                {value}
                {row.showCurrency !== undefined && row.value ? (
                  <span className="currency"> {this.state.currency}</span>
                ) : (
                  ""
                )}
              </span>
            </div>
          );
        })}
      </div>
    );
  }
}

export default VariantRow;
