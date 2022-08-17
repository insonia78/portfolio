import React from "react";
import { Layout, Card } from "@shopify/polaris";

class IntegrationContainer extends React.Component {
  render() {
    return (
      <Layout.Section>
        <div className="nk-download">
          <div className="data">
            <div className="thumb">
              <img src={this.props.icon} alt="" />
            </div>
            <div className="info">
              <h6 className="title">
                <span className="name">{this.props.name}</span>
              </h6>
            </div>
          </div>
          <div className="actions">{this.props.component}</div>
        </div>
      </Layout.Section>
    );
  }
}

export default IntegrationContainer;
