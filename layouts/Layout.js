import { connect } from "react-redux";
import { compose } from "recompose";

import Landing from "./Landing";
import Login from "./Login";
import GeneralWithSidebar from "./GeneralWithSidebar";

function Layout({ route, ...props }) {
  switch (route) {
    case "platforms":
      return <Landing {...props} />;
    case "login":
      return <Login {...props} />;
    default:
      return <GeneralWithSidebar {...props} />;
  }
}

export default compose(
  connect(state => ({
    route: state.route.name
  }))
)(Layout);
