import PropTypes from "prop-types";
import useEntity from "../hooks/useEntity";

function RelatedTitle(props) {
  const { record} = props;
  const entity = useEntity(record.entity.id);
  const orderedTitleFields = entity.fields.filtered.title;

  return orderedTitleFields
    .map(field => record[field.id])
    .filter(s => !!s)
    .join(" ∙ ");
}

RelatedTitle.propTypes = {
  record: PropTypes.object.isRequired,
};

export default RelatedTitle;
