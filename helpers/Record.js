import { runCode, RecordContext } from "blondie-platform-common";
import _ from "lodash";
import { STATE_TYPES } from "blondie-platform-common";

function getExistingLinks(firestore, draft, fields) {
  return fields.reduce((obj, field) => {
    if (!!field.relation && draft[field.id]) {
      obj[field.id] = {
        relation: firestore.collection("relations").doc(field.relation.id),
        [field.relationType === "source" ? "target" : "source"]: firestore
          .collection("records")
          .doc(draft[field.id])
      };
    }

    return obj;
  }, {});
}

export function getLinksToDelete(firestore, draft, fields) {
  return fields.reduce((obj, field) => {
    if (!!field.relation) {
      obj[field.id] = {
        relation: firestore.collection("relations").doc(field.relation.id),
        [field.relationType === "source" ? "target" : "source"]: true
      };
    }

    return obj;
  }, {});
}

function rejectLinks(draft, links) {
  return _(draft)
    .keys()
    .reject(Object.keys(links))
    .reduce((obj, fieldId) => {
      obj[fieldId] = draft[fieldId];
      return obj;
    }, {});
}

async function deleteUnusedRecordLinks(firestore, record, links) {
  for (const field of Object.keys(links)) {
    const data = links[field];
    const existingLinks = await firestore.get({
      collection: "links",
      where: [
        ["relation", "==", firestore.collection("relations").doc(data.relation.id)],
        [data.source ? "target" : "source", "==", firestore.collection("records").doc(record.id)]
      ]
    });

    Promise.all(existingLinks.docs.map(link => firestore.delete(`links/${link.id}`)));
  }
}

async function createNewRecordLinks(firestore, record, links) {
  await Promise.all(
    _(links)
      .keys()
      .map(field => {
        const data = links[field];
        if (data.source ? data["source"] : data["target"]) {
          firestore.collection("links").add({
            ...data,
            [data.source ? "target" : "source"]: firestore
              .collection("records")
              .doc(record.id)
          });
        }
      })
      .value()
  );
}

async function updateCounters(fields) {
  await Promise.all(fields.map(async (field) => {
    const { type } = field;
    if (type) {
      const { autoIncrement, autoIncrementStartAt = 1, autoIncrementCurrent } = type;

      if (autoIncrement) {
        type.update({
          autoIncrementCurrent: (autoIncrementCurrent ? autoIncrementCurrent + 1 : null) || autoIncrementStartAt || 1
        });
      }
    }
  }));
}

async function processAutomations(firestore, entityId, fields, draft) {
  const recordId = draft.id;
  const processedAttrs = { persistable: { ...draft }, validatable: { ...draft } };

  await Promise.all(fields.map(async (field) => {
    const { type } = field;
    if (type) {
      const { autoCalculate, autoGenerate, autoIncrement, autoIncrementStartAt = 1, autoIncrementCurrent } = type;

      if (autoIncrement && !recordId) {
        const value = await runCode(autoIncrement, {
          this: new RecordContext({
            entityId,
            record: draft,
            recordId,
            firestore
          }),
          counter: (autoIncrementCurrent ? autoIncrementCurrent + 1 : null) || autoIncrementStartAt || 1
        });

        if (value) {
          processedAttrs.validatable[field.id] = value;
          processedAttrs.persistable[field.id] = value;
        }
      } else if (autoGenerate && !recordId) {
        const value = await runCode(autoGenerate, {
          this: new RecordContext({
            entityId,
            record: draft,
            recordId,
            firestore
          })
        });

        if (value) {
          processedAttrs.validatable[field.id] = value;
          processedAttrs.persistable[field.id] = value;
        }
      } else if (autoCalculate) {
        const value = await runCode(autoCalculate, {
          this: new RecordContext({
            entityId,
            record: draft,
            recordId,
            field,
            firestore
          })
        });

        if (value) {
          processedAttrs.validatable[field.id] = value;
        }
      }
    }
  }));

  return processedAttrs;
}

async function validate(firestore, entityId, fields, validatableAttrs) {
  const errorsArray = await Promise.all(fields.map(async (field) => {
    if (field.required && !validatableAttrs[field.id]) {
      return [field.id, "is required"];
    } else if (validatableAttrs[field.id]) {
      const errs = await Promise.all(field.validators.ordered.map(validator => {
        return runCode(validator.errorGenerator, {
          this: new RecordContext({ entityId, record: validatableAttrs, firestore }),
          value: validatableAttrs[field.id]
        });
      }));
      const error = errs.filter(e => !!e)[0];
      if (error) {
        return [field.id, error];
      }
    }
  }));
  const errors = errorsArray.reduce((cum, err) => {
    if (err) {
      cum[err[0]] = err[1];
    }
    return cum;
  }, {});
  return errors;
}

function filterValues(persistableAttrs, processedAttrs) {
  const attrs = { ...persistableAttrs, ...processedAttrs.persistable };
  return Object.keys(attrs).reduce((cum, key) => {
    const value = attrs[key];
    if (!_.isUndefined(value)) {
      cum[key] = value;
    }
    return cum;
  }, {});
}

class Record {
  constructor(firestore, configuration, entityId, attrs, auth, parentRecordId, relation) {
    this.firestore = firestore;
    this.configuration = configuration;
    this.entityId = entityId;
    this.attrs = attrs;
    this.auth = auth;
    this.parentRecordId = parentRecordId;
    this.relation = relation;
  }

  isPersisted() {
    return !!(this.attrs && this.attrs.id);
  }

  async save() {
    const { firestore, configuration, entityId, attrs, auth } = this;
    const fields = configuration.entities.data[entityId].fields.filtered.form;
    const draft = { ...attrs };
    let links = getExistingLinks(firestore, draft, fields);
    const linksToDelete = getLinksToDelete(firestore, draft, fields);
    const persistableAttrs = rejectLinks(draft, links);

    const processedAttrs = await processAutomations(firestore, entityId, fields, draft);
    const validatableAttrs = { ...persistableAttrs, ...processedAttrs.validatable };

    this.errors = await validate(firestore, entityId, fields, validatableAttrs);

    if (!_.isEmpty(this.errors)) return this;

    const filteredAttrs = filterValues(persistableAttrs, processedAttrs);

    let record;

    if (this.isPersisted()) {
      record = await firestore.update(`records/${draft.id}`, {
        ...filteredAttrs,
        uid: auth.uid
      });
    } else {
      record = await firestore.add(`records`, {
        ...filteredAttrs,
        entity: firestore.collection("entities").doc(entityId),
        state: STATE_TYPES.ACTIVE,
        uid: auth.uid
      });

      this.attrs.id = record.id;

      await updateCounters(fields);
    }

    await deleteUnusedRecordLinks(firestore, record || draft, linksToDelete);
    links = await this.appendParentRecordLink(links, fields);
    await createNewRecordLinks(firestore, record || draft, links);
  }

  async appendParentRecordLink(links, fields) {
    if (!this.parentRecordId || !this.relation) {
      return links;
    }
    const fieldsMappedById = fields.reduce((acc, field) => {
      acc[field.id] = field;

      return acc;
    }, {});

    // parent record link was already created earlier, relation field was added to draft
    const alreadyGotLink = Object.keys(links).some((fieldId) => {
      const field = fieldsMappedById[fieldId];

      return field && !!field.relation && field.relation.id === this.relation.id;
    });

    if (alreadyGotLink) {
      return links;
    }

    const relationType = this.relation.source.find((entity) => entity.id === this.entityId) ? "source" : "target";
    const oppositeRelationType = relationType === "source" ? "target" : "source";

    const { empty } = await this.firestore
      .collection('links')
      .where("relation", "==", this.firestore.collection("relations").doc(this.relation.id))
      .where(relationType, "==", this.firestore.collection("records").doc(this.attrs.id))
      .where(oppositeRelationType, "==", this.firestore.collection("records").doc(this.parentRecordId))
      .get();

    if (!empty) {
      return links;
    }

    links[this.relation.id] = {
      relation: this.firestore.collection("relations").doc(this.relation.id),
      [this.relation.source.find((relEntity) => relEntity.id === this.entityId)  ? "target" : "source"]: this.firestore
        .collection("records")
        .doc(this.parentRecordId)
    };

    return links;
  }
}

export default Record;
