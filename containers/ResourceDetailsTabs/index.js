import React, { useMemo, useCallback } from "react";
import Tabs from "@material-ui/core/Tabs";
import { makeStyles } from "@material-ui/core";

import { Router } from "../../routes";
import ResourceDetailsTab from "components/ResourceDetailsTab";
import useRouteName from "../../hooks/useRouteName";
import useRouteParams from "../../hooks/useRouteParams";
import useFieldValue from "../../hooks/useFieldValue";

const useStyles = makeStyles({
  tabs: {
    width: "100%",

    "& button": {
      flex: 1
    }
  }
});

const TABS = [
  {
    name: "details",
    routes: ["resourceNew", "resource", "resourceEdit"],
    route: "resource",
    label: "Details"
  },
  {
    name: "timeline",
    routes: ["resource"],
    route: "resource",
    label: "Timeline"
  },
  {
    name: "files",
    routes: ["resourceFiles"],
    route: "resourceFiles",
    label: "Files",
    badgeContent: ({ storageRefs }) => storageRefs && storageRefs.length
  }
];


function ResourceDetailsTabs() {
  const classes = useStyles();
  const route = useRouteName();
  const routeParams = useRouteParams();
  const { entityId, id: recordId } = routeParams;
  const [storageRefs] = useFieldValue(entityId, recordId, 'storageRefs');

  const record = useMemo(() => ({ storageRefs }), [storageRefs]);
  const value = TABS.findIndex(item => item.routes.includes(route));
  const onChange = useCallback((e, tabIndex) => {
    const tab = TABS[tabIndex];
   
    console.log({ tab, routeParams });
   
    Router.pushRoute(tab.route, routeParams);
  }, [routeParams]);

  return (
    <Tabs
      indicatorColor="primary"
      textColor="primary"
      variant="fullWidth"
      value={value}
      onChange={onChange}
      className={classes.tabs}
    >
      {TABS.map(tab => (
        <ResourceDetailsTab
          key={tab.name}
          config={tab}
          record={record}
        />
      ))}
    </Tabs>
  );
}

export default ResourceDetailsTabs;
