import React from "react";

import RelatedList from "containers/RelatedList";
import useRouteParams from "hooks/useRouteParams";
import useEntity from '../hooks/useEntity';
import useConfiguration from '../hooks/useConfiguration';

function RelatedLists(props) {
  const { entityId, id } = useRouteParams();
  const entity = useEntity(entityId);
  const configuration = useConfiguration();
  const entities = configuration.entities.data;

  return (
    <>
      {entity.sourceRelations.filtered.many.filter(({ targetType }) => targetType === "many").map(relation => (
        <RelatedList
          key={relation.id}
          relationEntities={relation.target.map((entityDocRef) => entities[entityDocRef.id])}
          relationType="source"
          relation={relation}
          recordId={id}
        />
      ))}

      {entity.sourceRelations.filtered.one.filter(({ targetType }) => targetType === "many").map(relation => (
        <RelatedList
          key={relation.id}
          relationEntities={relation.target.map((entityDocRef) => entities[entityDocRef.id])}
          relationType="source"
          relation={relation}
          recordId={id}
        />
      ))}

      {entity.targetRelations.filtered.many.filter(({ sourceType }) => sourceType === "many").map(relation => (
        <RelatedList
          key={relation.id}
          relationEntities={relation.source.map((entityDocRef) => entities[entityDocRef.id])}
          relationType="target"
          relation={relation}
          recordId={id}
        />
      ))}

      {entity.targetRelations.filtered.one.filter(({ sourceType }) => sourceType === "many").map(relation => (
        <RelatedList
          key={relation.id}
          relationEntities={relation.source.map((entityDocRef) => entities[entityDocRef.id])}
          relationType="target"
          relation={relation}
          recordId={id}
        />
      ))}
    </>
  );
}

export default RelatedLists;
