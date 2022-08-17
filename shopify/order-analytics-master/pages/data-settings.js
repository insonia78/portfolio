import React from "react";
import Table from "../components/Table";
const currencyFields = ["retail_price", "handling_fee", "cost"];
const percentFields = ["margin"];

class DataSettings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      limit: 10,
      page: 1,
    };

    this.getProducts = this.getProducts.bind(this);
  }

  async processFields(product) {
    let newProduct = {};

    for (let field in product) {
      if (field === "variants") {
        continue;
      }

      newProduct[field] = {
        id: field,
        value: product[field],
      };

      if (currencyFields.includes(field)) {
        newProduct[field].showCurrency = true;
      }

      if (percentFields.includes(field)) {
        newProduct[field].showPercent = true;
      }
    }

    return newProduct;
  }

  async processProducts(productsData) {
    let newProducts = [];

    for (let i = 0; i < productsData.length; i++) {
      let variants = [];
      variants = productsData[i].variants;
      let newProduct = await this.processFields(productsData[i]);
      newProduct.variants = [];
      for (let j = 0; j < variants.length; j++) {
        newProduct.variants.push(await this.processFields(variants[j]));
      }

      newProducts.push(newProduct);
    }

    return newProducts;
  }

  getProducts() {
    fetch(
      `/api/v1/data-settings/products?limit=${this.state.limit}&page=${this.state.page}`,
      { method: "GET" }
    )
      .then((data) => data.json())
      .then(async (data) => {
        this.setState({ data: await this.processProducts(data.data) });
      });
  }

  componentDidMount() {
    this.getProducts();
  }

  render() {
    let header = [
      { title: "Product name" },
      { title: "Vendor" },
      { title: "Retail price" },
      { title: "Handling fee" },
      { title: "Product cost" },
      { title: "Margin" },
      { title: "Inventory" },
    ];
    return (
      <Table
        header={header}
        data={this.state.data}
        showCheckboxes={true}
        parentField="parent_id"
        fieldsToDisplay={[
          "name",
          "vendor",
          "retail_price",
          "handling_fee",
          "cost",
          "margin",
          "inventory",
        ]}
        inputFields={["handling_fee"]}
      />
    );
  }
}

export default DataSettings;
