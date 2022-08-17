import React from "react";

class Input extends React.Component {
  render() {
    return <input type="text" className="form-control" {...this.props} />;
  }
}

export default Input;
