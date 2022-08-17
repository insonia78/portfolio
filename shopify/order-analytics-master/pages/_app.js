import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import React from "react";
import App, { Container } from "next/app";
import { AppProvider } from "@shopify/polaris";
import Cookies from "js-cookie";
import "@shopify/polaris/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import SideBar from "../components/SideBar";
import Header from "../components/Header";
import "../public/css/dashlite.css";
import "../public/js/bundle";
import "../public/js/scripts";

const client = new ApolloClient({
  fetchOptions: {
    credentials: "include",
  },
});

class MyApp extends App {
  render() {
    const { Component, pageProps } = this.props;
    const shopOrigin = Cookies.get("shopOrigin");
    return (
      <div className="nk-main ">
        <script type="text/javascript" src="/_next/static/js/bundle.js" />
        <script type="text/javascript" src="/_next/static/js/scripts.js" />
        <SideBar
          menuItems={[
            {
              path: "/dashboard",
              icon: "dashboard-fill",
              title: "Dashboard",
            },
            {
              path: "/products-insights",
              icon: "package-fill",
              title: "Products Insights",
            },
            {
              path: "/orders",
              icon: "view-list-sq",
              title: "All orders",
            },
            {
              path: "/marketing",
              icon: "globe",
              title: "Marketing Analysis",
            },
            {
              path: "/data-settings",
              icon: "package-fill",
              title: "Data Settings",
            },
            {
              path: "/integrations",
              icon: "link",
              title: "Integrations",
            },
            {
              path: "/preferences",
              icon: "setting",
              title: "Preferences",
            },
          ]}
        />
        <div className="nk-wrap">
          <Header />
          <div className="nk-content">
            <Container>
              <AppProvider i18n={translations}>
                <ApolloProvider client={client}>
                  <Component {...pageProps} />
                </ApolloProvider>
              </AppProvider>
            </Container>
          </div>
        </div>
      </div>
    );
  }
}

export default MyApp;
