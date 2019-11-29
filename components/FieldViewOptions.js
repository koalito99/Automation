import React from 'react';
import Typography from '@material-ui/core/Typography';
import FieldViewOption from './FieldViewOption';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles({
  gridContainer: {
    margin: '4px 0'
  }
});

function FieldViewOptions(props) {
  const {
    value,
    ...fieldProps
  } = props;

  const classes = useStyles();

  return (
    <div>
      <Typography variant="subtitle1">
        {fieldProps.label}
      </Typography>
      {
        value ? value.map((option) => (
            <div className={classes.gridContainer}>
              <FieldViewOption option={option} />
            </div>
          ))
          :
          <Typography variant="body2">
            There are no {fieldProps.label}
          </Typography>
      }
    </div>
  );
}

export default FieldViewOptions;
