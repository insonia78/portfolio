import React from "react";
import Row from "./Table/Row";
import { Toast, Frame } from "@shopify/polaris";
import VariantRow from "./Table/VariantRow";

class Table extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      toast: false,
      variantsOpen: [],
      toastMessage: "Saved",
    };

    this.showMessage = this.showMessage.bind(this);
    this.toastDismiss = this.toastDismiss.bind(this);
    this.variantsOpen = this.variantsOpen.bind(this);
    this.setVariantsOpen = this.setVariantsOpen.bind(this);
  }

  showMessage(message) {
    this.setState({
      toastMessage: message,
      toast: true,
    });
  }

  toastDismiss() {
    this.setState({ toast: false });
  }

  variantsOpen(rowId) {
    if (this.state.variantsOpen[rowId] === undefined) {
      return false;
    }

    return this.state.variantsOpen[rowId];
  }

  setVariantsOpen(rowId, opened) {
    let data = this.state.variantsOpen;
    data[rowId] = opened;

    this.setState({
      variantsOpen: data,
    });
  }

  render() {
    return (
      <div>
        <div className="nk-tb-list is-separate is-medium mb-3">
          <div className="nk-tb-item nk-tb-head">
            {this.props.showCheckboxes ? (
              <div className="nk-tb-col nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext">
                  <input
                    type="checkbox"
                    className="custom-control-input"
                    id="uid"
                  />
                  <label className="custom-control-label" htmlFor="uid"></label>
                </div>
              </div>
            ) : null}

            {this.props.parentField !== undefined ? (
              <div className="nk-tb-col nk-tb-col-check">
                <div className="custom-control custom-control-sm custom-checkbox notext"></div>
              </div>
            ) : null}

            {this.props.header.map((headerItem, id) => {
              return (
                <div className="nk-tb-col" key={id}>
                  <span>{headerItem.title}</span>
                </div>
              );
            })}
          </div>

          {this.props.data.map((row, id) => {
            let data = [
              <Row
                key={id}
                rowId={id}
                row={row}
                showCheckboxes={this.props.showCheckboxes}
                fieldsToDisplay={
                  this.props.fieldsToDisplay !== undefined
                    ? this.props.fieldsToDisplay
                    : []
                }
                parentField={
                  this.props.parentField !== undefined
                    ? this.props.parentField
                    : false
                }
                inputFields={
                  this.props.inputFields !== undefined
                    ? this.props.inputFields
                    : false
                }
                showMessage={this.showMessage}
                variantsOpen={this.variantsOpen(id)}
                setVariantsOpen={this.setVariantsOpen}
              />,
            ];

            if (row.variants && row.variants.length > 1) {
              {
                row.variants.map((variant, variantId) => {
                  data.push(
                    <VariantRow
                      row={variant}
                      key={variantId}
                      hidden={!this.variantsOpen(id)}
                      fieldsToDisplay={
                        this.props.fieldsToDisplay !== undefined
                          ? this.props.fieldsToDisplay
                          : []
                      }
                      inputFields={
                        this.props.inputFields !== undefined
                          ? this.props.inputFields
                          : false
                      }
                      showMessage={this.showMessage}
                    />
                  );
                });
              }
            }

            return data;
          })}
        </div>

        {this.state.toast ? (
          <Frame>
            <Toast
              content={this.state.toastMessage}
              duration={2000}
              onDismiss={this.toastDismiss}
            />
          </Frame>
        ) : null}
      </div>
    );
  }
}

export default Table;
