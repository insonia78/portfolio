import React from "react";
import { Layout } from "@shopify/polaris";
import IntegrationContainer from "../components/IntegrationContainer";
import Facebook from "../components/Integrations/Facebook";
import Google from "../components/Integrations/Google";
import facebookIcon from "../public/images/facebook.png";
import googleIcon from "../public/images/google.png";

class Integrations extends React.Component {
  render() {
    return (
      <Layout>
        <IntegrationContainer
          name="Facebook ads"
          component={<Facebook />}
          icon={facebookIcon}
        />
        <IntegrationContainer
          name="Google ads"
          component={<Google />}
          icon={googleIcon}
        />
      </Layout>
    );
  }
}

export default Integrations;
