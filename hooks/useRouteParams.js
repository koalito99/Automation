import _ from "lodash";
import { useSelector } from "react-redux";

function useRouteParams() {
  return useSelector(state => _.get(state, ["route", "query"]));
}

export default useRouteParams;
