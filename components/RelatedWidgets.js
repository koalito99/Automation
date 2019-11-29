import React from "react";

import RelatedWidget from "containers/RelatedWidget";
import useEntity from '../hooks/useEntity';

function RelatedWidgets(props) {
  const { entityId } = props;
  const entity = useEntity(entityId);

  return entity.widgets.ordered.map(widget => (
    <RelatedWidget key={widget.id} widget={widget} />
  ));
}

export default RelatedWidgets;
