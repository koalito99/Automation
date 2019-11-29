import React from "react";
import { Router } from "../routes";

export default class IndexPage extends React.Component {
  componentDidMount() {
    Router.pushRoute("platforms");
  }

  render() {
    return null;
  }
}
