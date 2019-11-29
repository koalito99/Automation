import { compose, withProps } from "recompose";
import { connect } from "react-redux";
import { firestoreConnect, withFirestore } from "react-redux-firebase";

import Link from "@material-ui/core/Link";

import firestoreConnectForKeys from "helpers/firestoreConnectForKeys";
import withRouterParams from "helpers/withRouterParams";

import { Router } from "../../routes";
import InlineLoading from "../../components/InlineLoading";
import withConfiguration from '../../helpers/withConfiguration';

const mapLinksStateToProps = (state, props) => ({
  links:
    state.firestore.ordered[
      `links/${props.field.relation.id}/${props.field.relationType}/${props.record.id ||
      props.record.objectID}`
      ]
});

const mapRecordsStateToProps = (state, props) => ({
  records:
    props.links &&
    _(props.links)
      .map(link => {
        const id =
          props.field.relationType === "target"
            ? link.source && link.source.id
            : link.target && link.target.id;

        return {
          id,
          ...(state.firestore.data.records && state.firestore.data.records[id])
        };
      })
      .filter()
      .value()
});

const onClickHandler = params => e => {
  e.stopPropagation();
  e.preventDefault();

  Router.pushRoute("resource", params);
};

const containsOnlyIdParam = (records) => {
  return records.length && _.some(records, (record) => Object.keys(record).length === 1);
};

function FieldValueRelation({ platformId, records, configuration, view }) {
  return !records || (records.length && containsOnlyIdParam(records)) ? (
    <InlineLoading />
  ) : (
    _(records)
      .map(record => {
        return (
          <Link
            key={record.id || record.objectID}
            href=""
            onClick={onClickHandler({
              platformId,
              entityId: record.entity.id,
              id: record.id || record.objectID,
              view
            })}
          >
            {record && configuration.entities.data[record.entity.id].fields.filtered.title
              .map(field => record[field.id])
              .filter(s => !!s)
              .join(" ∙ ")}
          </Link>
        );
      })
      .value()
  );
}

export default compose(
  withFirestore,
  withRouterParams("platformId", "view"),
  withConfiguration,
  firestoreConnect(({ firestore, field, record }) => {
    if (!record.id && !record.objectID) {
      return [];
    }

    return [
      {
        collection: "links",
        where: [
          ["relation", "==", firestore.collection("relations").doc(field.relation.id)],
          [
            field.relationType,
            "==",
            firestore.collection("records").doc(record.id || record.objectID)
          ]
        ],
        storeAs: `links/${field.relation.id}/${field.relationType}/${record.id || record.objectID}`
      }
    ];
  }),
  connect(mapLinksStateToProps),
  firestoreConnectForKeys("links", ({ field, links }) => {
    return _(links)
      .map(link => {
        const doc =
          field.relationType === "target"
            ? link.source && link.source.id
            : link.target && link.target.id;

        if (!doc) return;

        return {
          collection: "records",
          doc
        };
      })
      .filter()
      .value();
  }),
  connect(mapRecordsStateToProps),
)(FieldValueRelation);
