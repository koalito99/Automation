import { compose, withHandlers, withState, lifecycle } from "recompose";
import { connect } from "react-redux";
import { withFirestore } from "react-redux-firebase";

import { STATE_TYPES } from "blondie-platform-common";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";

import connectPermissions from "connectors/permissions";
import getFieldPermissions from "selectors/getFieldPermissions";
import { runCode } from "blondie-platform-common";

export function connector({ firestore, entityId }) {
  return [
    {
      collection: "fields",
      where: [
        ["state", "==", STATE_TYPES.ACTIVE],
        ["entity", "==", firestore.collection("entities").doc(entityId)]
      ],
      storeAs: `entities/${entityId}/fields`
    }
  ];
}

export function selector(state, props) {
  return state.firestore.ordered[`entities/${props.entityId}/fields`];
}

const mapStateToProps = (state, props) => ({
  rawFields: selector(state, props),
  fieldPermissions: getFieldPermissions(state)
});

export default compose(
  connectPermissions,
  connect(mapStateToProps),
  withFirestore,
  firestoreConnectForKeys("entityId", connector),
  withState("fields", "setFields"),
  withHandlers({
    fetchFields: ({
      auth,
      entityId,
      fieldPermissions,
      rawFields,
      fields,
      setFields
    }) => async force => {
      if (!fieldPermissions) return;
      if (!rawFields) return;
      if (!force && fields) return;

      const newFields = await Promise.all(
        rawFields.map(async field => {
          if (fieldPermissions.length === 0) return field;

          const results = await Promise.all(
            fieldPermissions.map(async permission => {
              const result = await runCode(permission.rule, { auth, entityId, field });

              return result;
            })
          );

          if (!_.some(results, r => !r)) {
            return field;
          }
        })
      );

      const filteredFields = _.filter(newFields);

      setFields(filteredFields);
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.fetchFields();
    },
    componentDidUpdate({ fields, rawFields }) {
      if (!this.props.fields || rawFields !== this.props.rawFields) {
        this.props.fetchFields(true);
      }
    }
  })
);
