import { compose, withHandlers } from "recompose";
import ColorSelector from "../../components/ColorSelector";

export default compose(
  withHandlers({
    onChangeHandler: ({ onChange }) => color => {
      onChange({ target: { value: color } });
    }
  })
)(ColorSelector);
