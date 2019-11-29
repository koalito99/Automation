import _ from "lodash";
import { branch, renderComponent } from "recompose";
import Loading from "../components/Loading";

export default (...args) =>
  branch(props => {
    return _.some(args, key => {
      return !_.get(props, key, false);
    });
  }, renderComponent(Loading));
