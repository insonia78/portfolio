import React from "react";
import Button from "../Button";
import FacebookAuth from "react-facebook-auth";

class Facebook extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      connected: false,
    };

    this.getFacebookButton = this.getFacebookButton.bind(this);
  }

  getFacebookButton({ onClick }) {
    return (
      <Button
        onClick={onClick}
        title={this.state.connected ? "Connected" : "Add facebook"}
        type={this.state.connected ? "info" : "primary"}
      />
    );
  }

  componentDidMount() {
    fetch("/api/v1/integration-status?type=facebook")
      .then((result) => result.json())
      .then((json) => {
        this.setState({
          connected: json.data,
        });
      });
  }

  authenticate(response) {
    fetch(
      "/api/v1/save-integration/facebook?key=" +
        encodeURIComponent(response.accessToken)
    );
  }

  render() {
    return this.state.connected ? (
      this.getFacebookButton(() => {})
    ) : (
      <FacebookAuth
        appId="955257815297762"
        scope="ads_read,ads_management,read_insights"
        returnScopes={true}
        callback={this.authenticate}
        component={this.getFacebookButton}
        reRequest={true}
      />
    );
  }
}

export default Facebook;
