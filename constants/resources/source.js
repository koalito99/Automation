import _ from "lodash";
import buildResource from "helpers/buildResource";

import SOURCES from "constants/sources";

export default buildResource("Source", {
  searchBy: ({ name }) => name,
  orderBy: source => _.get(source, "name", "").toLowerCase(),
  schema: [
    {
      type: "input",
      name: "name",
      label: "Name",
      xs: 3
    },
    {
      type: "input",
      name: "type",
      label: "Type",
      xs: 3,
      skipForm: true
    }
  ],
  stateToProps: state => {
    return {
      items: SOURCES
    };
  }
});
