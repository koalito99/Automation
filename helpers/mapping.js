export function addSourceTypeMappings(node, firestore) {
  let sourceFieldCopy = node;

  const mappings = [];

  while (sourceFieldCopy.parent) {
    mappings.unshift({
      type: firestore
        .collection("source_types")
        .doc(
          sourceFieldCopy.parent.ref ? sourceFieldCopy.parent.refTypeId : sourceFieldCopy.parent.id
        ),
      field: firestore.collection("source_fields").doc(sourceFieldCopy.id)
    });

    sourceFieldCopy = sourceFieldCopy.parent;
  }

  return mappings;
}

export function addEntityMappings(node, firestore) {
  let mappings = [];

  if (node.parent.parent) {
    let entityFieldCopy = node;
    let first = true;

    while (entityFieldCopy.parent) {
      if (entityFieldCopy.parent.parent) {
        const fieldCollection = first ? "fields" : "relations";
        first = false;

        mappings.unshift({
          type: firestore
            .collection("entities")
            .doc(
              fieldCollection === "fields"
                ? entityFieldCopy.parent.oppositeEntityId
                : entityFieldCopy.parent.id
            ),
          field: firestore.collection(fieldCollection).doc(entityFieldCopy.id)
        });
      } else {
        mappings.unshift({
          type: firestore.collection("entities").doc(entityFieldCopy.parent.id),
          field: firestore.collection("relations").doc(entityFieldCopy.id)
        });
      }

      entityFieldCopy = entityFieldCopy.parent;
    }
  } else {
    mappings = [
      {
        type: firestore.collection("entities").doc(node.parent.id),
        field: firestore.collection("fields").doc(node.id)
      }
    ];
  }

  return mappings;
}
