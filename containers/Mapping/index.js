import { compose } from "redux";
import { connect } from "react-redux";
import { withState, lifecycle, withHandlers, withProps } from "recompose";
import { firestoreConnect, withFirestore, populate } from "react-redux-firebase";
import request from "axios";

import { Router } from "../../routes";

import withRouter from "helpers/withRouter";
import Mapping from "../../components/Mapping";
import { addEntityMappings, addSourceTypeMappings } from "../../helpers/mapping";

export default compose(
  withRouter,
  withFirestore,
  withState("loading", "setLoading", true),
  withState("sourceTypes", "setSourceTypes", []),
  withState("entities", "setEntities", []),
  withState("mappingDirection", "setMappingDirection", null),
  withState("sourceField", "setSourceField", null),
  withState("entityField", "setEntityField", null),
  firestoreConnect(({ firestore, platformId, sourceId }) =>
    !platformId
      ? []
      : [
          {
            collection: "mappings",
            where: [["source", "==", firestore.collection("sources").doc(sourceId)]]
          }
        ]
  ),
  connect(state => ({
    mappings: state.firestore.ordered.mappings
  })),
  withProps(({ entities, sourceTypes, mappings }) => {
    const existingCombinations = [];

    if (!entities.length || !sourceTypes.length) {
      return { existingCombinations };
    }

    const sourceFields = sourceTypes.reduce((accumulator, sourceType) => {
      console.log({ sourceType });
      sourceType.nodes.map(field => {
        accumulator[field.id] = { ...field, sourceType };
      });

      return accumulator;
    }, {});

    const entityFields = entities.reduce((accumulator, entity) => {
      entity.nodes.map(field => {
        accumulator[field.id] = { ...field, entity };
      });

      return accumulator;
    }, {});

    const grouped = {};

    mappings.map(mapping => {
      let mappingData;

      if (mapping.from[0].type.parent.id === "source_types") {
        mappingData = {
          id: mapping.id,
          sourceField: sourceFields[mapping.from[0].field.id],
          entityField: entityFields[mapping.to[0].field.id],
          sourceFields: mapping.from.map(mapping => sourceFields[mapping.field.id]),
          entityFields: mapping.to.map(mapping => entityFields[mapping.field.id]),
          sourceTypeId: mapping.from[0].type.id,
          entityTypeId: mapping.to[0].type.id,
          direction: "left",
          key: !!mapping.key
        };
      } else {
        mappingData = {
          id: mapping.id,
          sourceField: sourceFields[mapping.to[0].field.id],
          entityField: entityFields[mapping.from[0].field.id],
          sourceFields: mapping.to.map(mapping => sourceFields[mapping.field.id]),
          entityFields: mapping.from.map(mapping => entityFields[mapping.field.id]),
          sourceTypeId: mapping.to[0].type.id,
          entityTypeId: mapping.from[0].type.id,
          direction: "right",
          key: !!mapping.key
        };
      }

      existingCombinations.push(mapping.from[0].type.id + mapping.to[0].type.id);

      if (mappingData.sourceField && mappingData.entityField) {
        let key = mappingData.sourceTypeId + mappingData.entityTypeId;
        if (!grouped[key]) {
          grouped[key] = {
            rows: [],
            sourceType: mappingData.sourceField.sourceType,
            entity: mappingData.entityField.entity
          };
        }

        grouped[key].rows.push(mappingData);
      } else {
        console.log(mapping);
      }
    });

    const sorted = Object.keys(grouped).map(key => {
      const group = grouped[key];
      group.rows = _.sortBy(group.rows, mapping =>
        mapping.sourceFields
          .filter(f => !!f)
          .map(field => field.value)
          .join(" ")
      );

      return group;
    });

    console.log({ sorted });

    return {
      groupedMappings: sorted,
      existingCombinations
    };
  }),
  withHandlers({
    handleSourceFieldClick: ({
      entityField,
      setSourceField,
      setEntityField,
      setMappingDirection,
      firestore,
      sourceId,
      existingCombinations
    }) => node => {
      if (!entityField) {
        setSourceField(node);
        setMappingDirection("right");

        return;
      }

      setEntityField(null);
      setMappingDirection(null);

      if (existingCombinations.includes(entityField.id + node.id)) {
        return;
      }

      let mappingData = {
        source: firestore.collection("sources").doc(sourceId),
        to: addEntityMappings(entityField, firestore),
        from: addSourceTypeMappings(node, firestore)
      };

      firestore.collection("mappings").add(mappingData);
    },
    handleEntityFieldClick: ({
      sourceField,
      setEntityField,
      setSourceField,
      setMappingDirection,
      firestore,
      sourceId,
      existingCombinations
    }) => node => {
      if (!sourceField) {
        setEntityField(node);
        setMappingDirection("left");

        return;
      }

      setSourceField(null);
      setMappingDirection(null);

      if (existingCombinations.includes(sourceField.id + node.id)) {
        return;
      }

      const mappingData = {
        source: firestore.collection("sources").doc(sourceId),
        from: addEntityMappings(node, firestore),
        to: addSourceTypeMappings(sourceField, firestore)
      };

      firestore.collection("mappings").add(mappingData);
    },
    handleKeyCheckboxClick: ({ firestore }) => async row => {
      await firestore
        .collection("mappings")
        .doc(row.id)
        .update({ key: !row.key });
    },
    onDelete: ({ firestore }) => mappingIds => {
      mappingIds.map(id => {
        firestore
          .collection("mappings")
          .doc(id)
          .delete();
      });
    }
  }),
  lifecycle({
    async componentDidMount() {
      const { sourceId, setSourceTypes, setEntities } = this.props;

      try {
        const res = await request.get(`${API_URL}/mapping/mapping/${sourceId}`);

        setSourceTypes(res.data.sourceTypes);
        setEntities(res.data.entities);
      } catch (e) {
        console.log("[--- index.js:25 ---]", e);
      }
    }
  })
)(Mapping);
