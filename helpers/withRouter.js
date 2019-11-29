import { connect } from 'react-redux'

const mapStateToProps = (state, props) => ({
  route: state.route.name,
  url: state.route.url,
  ...state.route.query,
  ...props
});

export default connect(mapStateToProps);