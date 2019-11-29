import { compose, lifecycle, withState, withHandlers } from 'recompose';
import { withFirestore } from 'react-redux-firebase';

import withRouterParams from 'helpers/withRouterParams';
import AutoCalculatedField from 'components/AutoCalculatedField';

import { runCode, RecordContext } from 'blondie-platform-common';

export default compose(
  withState('loading', 'setLoading', false),
  withState('calculatedValue', 'setCalculatedValue'),
  withRouterParams('entityId', 'id'),
  withFirestore,
  withHandlers({
    refresh: (props) => async () => {
      const { entityId, id, draft, firestore, value, setCalculatedValue, fieldType, setLoading, onChange } = props;

      if (!id) return;

      setCalculatedValue(value);
      setLoading(true);

      const result = await runCode(fieldType.autoCalculate || fieldType.autoGenerate || fieldType.autoIncrement, {
        this: new RecordContext({ entityId, recordId: id !== 'new' ? id : undefined, draft, firestore }),
        counter: fieldType.autoIncrementCurrent || fieldType.autoIncrementStartAt || 1
      });

      setCalculatedValue(result);
      setLoading(false);

      onChange({ target: { value: result } });
    }
  }),
  lifecycle({
    async componentDidMount() {
      await this.props.refresh();
    },
    async componentDidUpdate({ id }) {
      if (this.props.id !== id) {
        await this.props.refresh();
      }
    }
  })
)(AutoCalculatedField);
