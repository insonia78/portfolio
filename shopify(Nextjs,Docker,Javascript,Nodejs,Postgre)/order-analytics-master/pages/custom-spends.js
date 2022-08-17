import React from "react";
import Table from "../components/Table";
import { TextStyle, Card, DisplayText } from "@shopify/polaris";
const currencyFields = ["total_spend"];

class CustomSpendsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      limit: 10,
      page: 1,
    };

    this.getSpends = this.getSpends.bind(this);
  }

  async processFields(product) {
    let newSpend = {};

    for (let field in product) {
      newSpend[field] = {
        id: field,
        value: product[field],
      };

      if (currencyFields.includes(field)) {
        newSpend[field].showCurrency = true;
      }
    }

    return newSpend;
  }

  async processCustomSpends(customSpendsData) {
    let newCustomSpends = [];

    for (let i = 0; i < customSpendsData.length; i++) {
      newCustomSpends.push(await this.processFields(customSpendsData[i]));
    }

    return newCustomSpends;
  }

  getSpends() {
    fetch(
      `/api/v1/custom-spends?limit=${this.state.limit}&page=${this.state.page}`,
      { method: "GET" }
    )
      .then((data) => data.json())
      .then(async (data) => {
        this.setState({ data: await this.processCustomSpends(data.data) });
      });
  }

  componentDidMount() {
    this.getSpends();
  }

  render() {
    let header = [
      { title: "Category" },
      { title: "Start" },
      { title: "End" },
      { title: "Ongoing" },
      { title: "Frequency" },
      { title: "Spent" },
    ];
    return (
      <Card>
        <Table
          header={header}
          data={this.state.data}
          fieldsToDisplay={[
            "category",
            "start_date",
            "end_date",
            "ongoing",
            "frequency",
            "total_spend",
          ]}
        />
      </Card>
    );
  }
}

export default CustomSpendsPage;
