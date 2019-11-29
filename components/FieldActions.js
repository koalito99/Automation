import React from "react";
import PropTypes from "prop-types";
import FieldAction from "./FieldAction";

function FieldActions(props) {
  const { value, actions, record, recordId, entityId } = props;

  return actions.map(action => <FieldAction key={action.id} {...{ value, action, record, recordId, entityId }} />);
}

FieldActions.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default FieldActions;
