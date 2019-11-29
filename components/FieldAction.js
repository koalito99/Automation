import React, { useCallback, useMemo } from "react";
import PropTypes from "prop-types";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import Icon from "./Icon";
import useBlondieFlowTriggerAction from '../hooks/useBlondieFlowTriggerAction';

function FieldAction(props) {
  const { value, action, record, recordId, entityId } = props;
  const handleBlondieFlowTriggerAction = useBlondieFlowTriggerAction();

  const ActionIcon = useMemo(() => {
    return <Icon name={action.icon} color={action.color} />;
  }, [action]);

  const handleFlowTriggerAction = useCallback(async () => {
    await handleBlondieFlowTriggerAction(action, record, recordId);
  }, [value, action, record, recordId]);

  if (!value) return null;

  return (
    <Tooltip key={action.id} title={action.name}>
      {
        (() => {
          switch (action.type) {
            case "link":
              return <IconButton href={action.url.replace("{{value}}", value)} target={action.openType || "_blank"}>
                {ActionIcon}
              </IconButton>;

            case "blondie-flow-trigger":
              return <IconButton onClick={handleFlowTriggerAction}>
                {ActionIcon}
              </IconButton>;
          }
        })()
      }
    </Tooltip>
  );
}

FieldAction.propTypes = {
  action: PropTypes.object.isRequired,
  value: PropTypes.object
};

export default FieldAction;
