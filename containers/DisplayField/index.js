import { compose, lifecycle, withState, withHandlers, onlyUpdateForKeys } from "recompose";
import { withFirestore } from "react-redux-firebase";
import withRouterParams from "helpers/withRouterParams";
import DisplayField from "components/DisplayField";
import { runCode, RecordContext } from "blondie-platform-common";

import { connect } from "react-redux";
import getDraft from "../../selectors/getDraft";
import getDraftField from "../../selectors/getDraftField";
import getDraftFieldError from "../../selectors/getDraftFieldError";
import { setDraftField } from "../../actions/draft";

function isAutoCalculated(field) {
  const { type } = field;

  if (!type) return false;
  if (!type.autoIncrement && !type.autoGenerate && !type.autoCalculate) return false;

  return true;
}

function mapStateToProps(state, props) {
  const autoCalculated = isAutoCalculated(props.field);

  return {
    autoCalculated,
    fieldValue: getDraftField(
      state,
      props.parentEntityId || props.entityId,
      props.id,
      props.field.id
    ),
    fieldError: getDraftFieldError(
      state,
      props.parentEntityId || props.entityId,
      props.id,
      props.field.id
    ),
    draft: autoCalculated
      ? { ...getDraft(state, props.parentEntityId || props.entityId, props.id) }
      : null
  };
}

const mapDispatchToProps = dispatch => ({
  onChange: (entityId, id, fieldId, value) => dispatch(setDraftField(entityId, id, fieldId, value))
});

export default compose(
  withFirestore,
  withRouterParams("platformId", "entityId", "id"),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  withState("loading", "setLoading", false),
  withState("calculation", "setCalculation"),
  withState("value", "setValue"),
  withState("error", "setError"),
  onlyUpdateForKeys([
    "entityId",
    "draft",
    "autoCalculated",
    "id",
    "loading",
    "calculation",
    "fieldValue",
    "fieldError",
    "value",
    "field",
    "readOnly",
    "variant"
  ]),
  withHandlers({
    validate: ({ entityId, id, firestore, field, setError }) => async value => {
      let error;

      const errors = await Promise.all(
        _.map(field && field.validators && field.validators.ordered, validator => {
          return runCode(validator.errorGenerator, {
            this: new RecordContext({ entityId, recordId: id, firestore }),
            value
          });
        })
      );

      error = errors.filter(e => !!e)[0];

      setError(error);
    }
  }),
  withHandlers({
    onChangeHandler: props => e => {
      const {
        parentEntityId,
        entityId,
        id,
        onChangeMutate,
        onChange,
        field,
        firestore,
        validate
      } = props;

      const newValue =
        typeof onChangeMutate === "function"
          ? onChangeMutate(e.target.value, { firestore })
          : e && e.target
          ? e.target.value
          : e;

      onChange(parentEntityId || entityId, id, field.id, newValue);
      validate(newValue);
    }
  }),
  withHandlers({
    refresh: props => async () => {
      const {
        entityId,
        id,
        field,
        fieldValue,
        firestore,
        valueMutate,
        draft,
        setValue,
        setCalculation
      } = props;
      const { type } = field;

      const defaultValue =
        typeof valueMutate === "function" ? valueMutate(fieldValue) : fieldValue || "";

      if (!id) return void setValue(undefined);
      if (!type) return void setValue(undefined);
      if (!type.autoIncrement && !type.autoGenerate && !type.autoCalculate)
        return void setValue(undefined);
      if (type.autoIncrement && id !== "new") return void setValue(undefined);
      if (type.autoGenerate && defaultValue) return void setCalculation({ value: defaultValue });

      setCalculation({ loading: true });

      let result;

      try {
        result = await runCode(type.autoCalculate || type.autoGenerate || type.autoIncrement, {
          this: new RecordContext({
            entityId,
            recordId: id !== "new" ? id : undefined,
            record: draft,
            field,
            firestore
          }),
          counter:
            (type.autoIncrementCurrent ? type.autoIncrementCurrent + 1 : null) ||
            type.autoIncrementStartAt ||
            1
        });
      } catch (e) {
        setCalculation({ error: e });
      }

      setCalculation({ value: result });

      if (!defaultValue) {
        setValue(result);
      } else {
        setValue(undefined);
      }
    }
  }),
  lifecycle({
    componentDidMount() {
      this.props.refresh();
    },
    componentDidUpdate(props) {
      const idChanged = this.props.id !== props.id;
      const valuesChanged = this.props.autoCalculated && !_.isEqual(this.props.draft, props.draft);

      if (idChanged || valuesChanged) {
        this.props.refresh(this.props);
      }
    }
  })
)(DisplayField);
