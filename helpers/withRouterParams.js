import { connect } from "react-redux";

export default (...args) =>
  connect((state, props) => ({
    ...args.reduce((obj, key) => {
      obj[key] = props[key] || (key === "route" ? state.route.name : state.route.query[key]);
      return obj;
    }, {})
  }));
