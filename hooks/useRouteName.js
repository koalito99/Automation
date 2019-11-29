import _ from "lodash";
import { useSelector } from "react-redux";

function useRouteName() {
  return useSelector(state => _.get(state, ["route", "name"]));
}

export default useRouteName;
