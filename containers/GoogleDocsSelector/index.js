import { compose, withHandlers, withState } from "recompose";
import GoogleDocsSelector from "../../components/GoogleDocsSelector";

export default compose(
  withState("token", "setToken"),
  withHandlers({
    onChangeHandler: ({ onChange }) => async data => {
      console.log(data);
      if (data.action === "picked") {
        const { id, name, url } = data.docs[0];
        onChange({ target: { value: { id, name, url } } });
      }
    }
  })
)(GoogleDocsSelector);
