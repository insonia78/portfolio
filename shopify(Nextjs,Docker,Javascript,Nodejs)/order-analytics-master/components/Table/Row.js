import React from "react";
import { TextField } from "@shopify/polaris";
import Cookies from "js-cookie";
import VariantRow from "./VariantRow";

const WAIT_INTERVAL = 1000;

class Row extends React.Component {
  constructor(props) {
    super(props);

    this.handlePlusClick = this.handlePlusClick.bind(this);
    this.prepareRow = this.prepareRow.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);

    this.prepareRow();

    let handling = 0;
    if (this.props.row.handling_fee !== undefined) {
      handling = this.props.row.handling_fee.value;
    }

    this.state = {
      row: {},
      currency: Cookies.get("shopCurrency"),
      handling: handling,
    };
  }

  prepareRow() {
    let fieldsToCopy = ["retail_price", "handling_fee", "cost", "margin"];

    fieldsToCopy.map((field) => {
      if (this.props.row[field] !== undefined) {
        if (
          this.props.row.variants !== undefined &&
          this.props.row.variants.length === 1
        ) {
          //If we have only one variant, then we should copy it's fields to the main product
          this.props.row[field] = this.props.row.variants[0][field];
        } else {
          this.props.row[field] = { id: field, value: "Multiple Values" };
        }
      }
    });
  }

  componentWillMount() {
    this.timer = null;
  }

  handlePlusClick() {
    this.props.setVariantsOpen(this.props.rowId, !this.props.variantsOpen);
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
    let hasVariants = false;
    if (
      this.props.parentField &&
      this.props.row[this.props.parentField].value == 0 &&
      this.props.row["variants"].length > 1
    ) {
      hasVariants = true;
    }

    return (
      <div className="nk-tb-item">
        {this.props.showCheckboxes ? (
          <div className="nk-tb-col nk-tb-col-check">
            <div className="custom-control custom-control-sm custom-checkbox notext">
              <input
                type="checkbox"
                className="custom-control-input"
                id={this.props.rowId}
              />
              <label
                className="custom-control-label"
                htmlFor={this.props.rowId}
              />
            </div>
          </div>
        ) : null}

        {this.props.parentField ? (
          <div className="nk-tb-col">
            <span className="tb-lead">
              {hasVariants ? (
                <span
                  style={{ cursor: "pointer" }}
                  onClick={this.handlePlusClick}
                >
                  {this.props.variantsOpen ? "-" : "+"}
                </span>
              ) : (
                ""
              )}
            </span>
          </div>
        ) : null}

        {this.props.fieldsToDisplay.map((field, key) => {
          if (this.props.row[field] === undefined) {
            return false;
          }

          let row = this.props.row[field];
          let value = row.value;
          let tdClasses = "nk-tb-col";

          if (
            !hasVariants &&
            this.props.inputFields &&
            this.props.inputFields.includes(field)
          ) {
            tdClasses = tdClasses + " input-field";
            value = (
              <span className="table-input">
                <TextField
                  value={String(this.state.handling ? this.state.handling : "")}
                  onChange={this.handleInputChange}
                  label=""
                  labelHidden={true}
                  id={this.props.row["variants"][0].id.value}
                />
              </span>
            );
          }

          return (
            <div className={tdClasses} key={key}>
              <span className={isNaN(row.value) ? "tb-sub" : "tb-amount"}>
                {value}
                {row.showCurrency !== undefined && row.value ? (
                  <span className="currency"> {this.state.shopCurrency}</span>
                ) : row.showPercent !== undefined && row.value ? (
                  <span className="percent"> %</span>
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

export default Row;
