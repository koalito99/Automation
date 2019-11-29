import { compose, withHandlers } from "recompose";
import IconSelector from "../../components/IconSelector";

export default compose(
  withHandlers({
    onChangeHandler: ({ onChange }) => icon => {
      onChange({ target: { value: icon.name } });
    }
  })
)(IconSelector);
