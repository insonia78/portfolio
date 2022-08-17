import React from "react";

class Submit extends React.Component {
  render() {
    return <button type="submit" className="btn btn-light" {...this.props} />;
  }
}

export default Submit;
