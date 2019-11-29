import { useMemo, useCallback, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { InstantSearch, Configure, Index } from "react-instantsearch-dom";
import searchClient from "helpers/searchClient";
import clonePropTypes from "helpers/clonePropTypes";

import useConfiguration from "hooks/useConfiguration";
import useFieldValue from "hooks/useFieldValue";
import useFieldError from "hooks/useFieldError";
import EntitySelector from "./EntitySelector";
import useDraft from '../hooks/useDraft';
import { RecordContext, runCode } from 'blondie-platform-common';
import useFirestore from '../hooks/useFirestore';

function FieldEditLookup(props) {
  const { fieldId, entityId, recordId, defaultValue } = props;
  const [value, setValue] = useFieldValue(entityId, recordId, fieldId, defaultValue);
  const [fieldError] = useFieldError(entityId, recordId, fieldId);
  const onChange = useCallback(e => setValue(e.target.value), []);
  const configuration = useConfiguration();
  const { relation, relationType } = configuration.fields.data[fieldId];
  const entities = relation[relationType === "source" ? "target" : "source"];
  const childEntityId = entities[0].id;
  const draft = useDraft(entityId, recordId);
  const firestore = useFirestore();
  const [filters, setFilters] = useState({});
  const field = configuration.fields.data[fieldId];
  const { type } = field;
  const facetFilters = useMemo(() => {
    return [
      "state:active",
      ...Object.keys(filters).map(key => `${key}:${filters[key]}`)
    ];
  }, [filters]);

  useEffect(() => {
    const fn = async () => {
      if (type && type.filters) {
        const currentFieldEntityContext = new RecordContext({ firestore, entityId: childEntityId });
        const result = await runCode(type.filters, {
          this: new RecordContext({ entityId, record: draft, firestore })
        });

        let mappedResult = {};
        result && await Promise.all(Object.keys(result).map(async (filterKey) => {
            const fieldId = await currentFieldEntityContext.guessFieldId(filterKey);
            mappedResult[fieldId] = result[filterKey];
          }, {})
        );

        setFilters(mappedResult);
      }
    };

    fn();
  }, [draft]);

  return (
    <InstantSearch {...{ searchClient }} indexName={childEntityId}>
      <Configure {...{ facetFilters }} />
      <EntitySelector
        {...{
          searchClient,
          value,
          error: !!fieldError,
          onChange,
          entities
        }}
        {...props}
      />
      {
        entities.length > 1 && entities.map((entity) => (
          <Index indexName={entity.id} />
        ))
      }
    </InstantSearch>
  );
}

FieldEditLookup.propTypes = {};

FieldEditLookup.defaultProps = {
  fullWidth: true,
  variant: "outlined",
  margin: "none",
  InputLabelProps: { shrink: true }
};

export default FieldEditLookup;
