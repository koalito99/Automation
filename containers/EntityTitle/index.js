import _ from "lodash";
import { compose, lifecycle, withState, renderComponent } from "recompose";
import { InstantSearch, Configure } from "react-instantsearch-dom";
import searchClient from "helpers/searchClient";

function Title({ title }) {
  return title || "";
}

const EntitySelectorWrapper = compose(
  withState("title", "setTitle"),
  lifecycle({
    async componentDidMount() {
      const { entityId, value, title, setTitle, orderedTitleFields, searchClient } = this.props;

      if (value && !title) {
        const index = searchClient.initIndex(entityId);
        const object = await index.getObject(value);

        setTitle(
          orderedTitleFields
            .map(field => object[field.id])
            .filter(s => !!s)
            .join(" ∙ ")
        );
      }
    }
  })
)(Title);

export default props => (
  <InstantSearch searchClient={searchClient} indexName={props.entityId}>
    <Configure facetFilters={["state:active"]} />
    <EntitySelectorWrapper {...props} searchClient={searchClient} />
  </InstantSearch>
);
