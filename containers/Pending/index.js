import React from 'react';
import _ from 'lodash';

class Pending extends React.PureComponent {

  render() {
    return (
      <div>
        Page is not implemented yet
      </div>
    );
  }

}

export default (props) => (
  <Pending {...props} />
);
