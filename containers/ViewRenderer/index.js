import React from "react";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";

import useRouteParams from "hooks/useRouteParams";

import Master from "containers/Master";
import RecordsList from "components/RecordsList";
import MasterKanban from "containers/MasterKanban";
import useEntityView from '../../hooks/useEntityView';

function ViewRenderer(props) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("xs"));
  const { platformId, entityId, view } = useRouteParams();
  const entityView = useEntityView(view);

  if (isMobile) {
    return <RecordsList {...{ platformId, entityId, view }} />;
  }

  if (entityView && entityView.type === 'kanban') {
    return <MasterKanban />
  }
  
  return <Master />;
}

export default ViewRenderer;
