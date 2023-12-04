import React from "react";
// import { Row, Alert } from "react-bootstrap";

class Notification extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.show) {
      return <div></div>;
    }
    return null;
  }
}

export default Notification;
