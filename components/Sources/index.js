import React, { Fragment } from "react";
import CardsView from "components/CardsView";
import SourceDialog from "containers/SourceDialog";
import SOURCES from "constants/sources";
import _ from "lodash";

const countExistingSources = sources => ({ type }) => {
  return _(sources)
    .filter({ type })
    .size();
};

export default function({
  onOpenHandler,
  onCancelHandler,
  items,
  resource,
  isOpened,
  source,
  sources
}) {
  return (
    <Fragment>
      <SourceDialog isOpened={isOpened} source={source} onCancel={onCancelHandler} />
      {_(SOURCES)
        .groupBy(source => countExistingSources(sources)(source) > 0)
        .map((existingSources, hasExistingSources, index) => {
          return (
            <CardsView
              key={hasExistingSources === "true" ? "Enabled sources" : "Available sources"}
              onOpenHandler={onOpenHandler}
              items={existingSources}
              resource={resource}
              title={hasExistingSources === "true" ? "Enabled sources" : "Available sources"}
              countFn={countExistingSources(sources)}
            />
          );
        })
        .value()}
    </Fragment>
  );
}
