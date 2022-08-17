import React from "react";
import { Form, Modal } from "@shopify/polaris";
import Input from "./Form/Input";
import Submit from "./Form/Submit";

class CategoryForm extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      inputValue: "",
    };
  }

  addCategory() {
    fetch("/api/v1/add-category/" + encodeURIComponent(this.state.inputValue));
  }

  handleInputChange(value) {
    this.setState({ inputValue: value });
  }

  render() {
    return (
      <div style={{ height: 500 }}>
        <Modal
          title="Add category"
          activator={this.props.activator}
          primaryAction={{
            content: "Add category",
            onAction: this.addCategory,
          }}
        >
          <Input
            onChange={this.handleInputChange}
            value={this.state.inputValue}
          />
        </Modal>
      </div>
    );
  }
}
