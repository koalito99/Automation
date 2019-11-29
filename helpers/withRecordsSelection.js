import { connect } from 'react-redux'
import { setSelectedRecords } from 'actions/records';

const mapStateToProps = (state) => ({
  selected: state.records.selected
});

const mapDispatchToProps = (dispatch) => ({
  setSelected: (selected) => {
    dispatch(setSelectedRecords(selected));
  }
});

export default connect(mapStateToProps, mapDispatchToProps);