import React from "react";
import Button from "../Button";
import { GoogleLogin } from "react-google-login";

class Google extends React.Component {
  constructor(params) {
    super(params);

    this.state = {
      connected: false,
    };

    this.getGoogleButton = this.getGoogleButton.bind(this);
  }

  componentDidMount() {
    fetch("/api/v1/integration-status?type=google")
      .then((result) => result.json())
      .then((json) => {
        this.setState({
          connected: json.data,
        });
      });
  }

  authenticate(response) {
    fetch(
      "/api/v1/save-integration/google?code=" +
        encodeURIComponent(response.code)
    );
  }

  getGoogleButton({ onClick }) {
    return (
      <Button
        onClick={onClick}
        title={this.state.connected ? "Connected" : "Add google"}
        type={this.state.connected ? "info" : "primary"}
      />
    );
  }

  render() {
    return this.state.connected ? (
      this.getGoogleButton(() => {})
    ) : (
      <GoogleLogin
        clientId="1070935162365-6qbdcl0ftr862igm9pf7tgas10e9gd3g.apps.googleusercontent.com"
        scope="https://www.googleapis.com/auth/adwords"
        onSuccess={this.authenticate}
        onFailure={this.authenticate}
        render={this.getGoogleButton}
        cookiePolicy={"single_host_origin"}
        accessType={"offline"}
        responseType={"code"}
      />
    );
  }
}

export default Google;
