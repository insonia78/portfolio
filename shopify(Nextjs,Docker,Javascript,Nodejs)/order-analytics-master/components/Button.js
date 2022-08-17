import React from "react";

/**
 * types:
 * primary
 * secondary
 * success
 * danger
 * warning
 * info
 * light
 * dark
 */
class Button extends React.Component {
  render() {
    return (
      <button
        className={"btn btn-" + this.props.type}
        onClick={this.props.onClick}
      >
        {this.props.title}
      </button>
    );
  }
}

export default Button;
