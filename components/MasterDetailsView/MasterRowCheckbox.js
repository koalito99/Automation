import React from 'react';
import Checkbox from '@material-ui/core/Checkbox';

function MasterRowCheckbox(props) {
  const { id, selected, setSelected } = props;
  return (
    <Checkbox 
      checked={selected && selected.includes(id)} 
      onClick={e => {
        e.stopPropagation();
      }}
      onChange={() => {
        let newSelected = [...selected];

        if (selected.includes(id)) {
          newSelected = newSelected.filter(i => i !== id);
        } else {
          newSelected.push(id);
        }

        setSelected(newSelected);
      }}
    />
  );
}

export default MasterRowCheckbox;