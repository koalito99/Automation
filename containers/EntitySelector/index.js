import _ from "lodash";
import { compose, lifecycle, withState, withProps } from "recompose";
import { connectAutoComplete } from "react-instantsearch-dom";
import { InstantSearch, Configure, Highlight } from "react-instantsearch-dom";
import searchClient from "helpers/searchClient";

import EntitySelector from "components/EntitySelector";

const EntitySelectorWrapper = compose(
  connectAutoComplete,
  withState("currentOption", "setCurrentOption"),
  withProps(({ value, hits }) => {
    const options =
      hits &&
      hits.map(hit => ({
        label: hit,
        value: hit.objectID
      }));

    const option = options.find(option => option.value === value);

    return {
      options,
      option
    };
  }),
  lifecycle({
    async componentDidUpdate(prevProps) {
      const { entityId, value, option, setCurrentOption, currentOption } = this.props;

      if (value && !option && !currentOption) {
        const index = searchClient.initIndex(entityId);
        const object = await index.getObject(value);

        setCurrentOption({
          label: object,
          value
        });
      }

      if (!value && prevProps.value) {
        setCurrentOption(null);
      }
    }
  })
)(EntitySelector);

export default props => (
  <InstantSearch searchClient={searchClient} indexName={props.entityId}>
    <Configure facetFilters={["state:active"]} />
    <EntitySelectorWrapper {...props} searchClient={searchClient} />
  </InstantSearch>
);
