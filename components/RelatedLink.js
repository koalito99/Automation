import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useRouteParams from "hooks/useRouteParams";
import Link from "@material-ui/core/Link";
import RelatedTitle from "./RelatedTitle";
import Router from "../routes";
import { makeStyles } from "@material-ui/styles";
import useFirestore from "../hooks/useFirestore";
import useBuildPath from "../hooks/useBuildPath";

const useStyles = makeStyles({
  link: {
    cursor: "pointer"
  }
});

function RelatedLink(props) {
  const classes = useStyles();
  const { recordId } = props;
  const firestore = useFirestore();
  const { platformId, view } = useRouteParams();
  const [record, setRecord] = useState(null);
  const path = useBuildPath();

  useEffect(() => {
    const fn = async () => {
      if (!recordId) {
        return;
      }

      const doc = await firestore
        .collection("records")
        .doc(recordId)
        .get();

      const record = { ...doc.data(), id: doc.id };

      setRecord(record);
    };

    fn();
  }, [recordId]);

  if (!recordId || !record) return null;

  const routeParams = { platformId, entityId: record.entity.id, id: recordId, view };
  if (path) {
    routeParams.path = path;
  }

  return (
    <Router.Link route="resource" params={routeParams}>
      <Link className={classes.link}>
        <RelatedTitle {...{ record }} />
      </Link>
    </Router.Link>
  );
}

RelatedLink.propTypes = {
  recordId: PropTypes.string
};

export default RelatedLink;
