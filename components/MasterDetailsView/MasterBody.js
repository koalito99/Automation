import React from "react";
import _ from "lodash";
import { Fade } from "@material-ui/core";
import TableBody from "@material-ui/core/TableBody";

import MasterRow from "containers/MasterRow";
import EmptyState from "../EmptyState";

function MasterBody(props) {
  const {
    hits,
    entityId,
    configuration,
    setIndexing,
    selectable,
    actionable,
    onClickHandler
  } = props;

  return (
    <>
      <Fade in={hits.length === 0}>
        <div>
          <EmptyState
            image={require("../../assets/illustrations/followme2.svg")}
            title={`There is nothing here yet...`}
            description={`You can add one by clicking "Add new" at the top.`}
            position="absolute"
            ImageProps={{ style: { maxHeight: "30vh" } }}
          />
        </div>
      </Fade>
      <TableBody>
        {hits.map(hit => (
          <MasterRow
            key={hit.objectID}
            entityId={entityId}
            entity={hit}
            {...{ setIndexing, selectable, actionable, onClickHandler }}
          />
        ))}
      </TableBody>
    </>
  );
}

export default MasterBody;
