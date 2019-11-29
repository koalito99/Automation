import React from 'react';
import { Grid } from '@material-ui/core';
import OptionField from './OptionField';
import _ from 'lodash';

const fieldOptions = {
  InputLabelProps: { shrink: true },
  fullWidth: true,
  readOnly: true
};

export default function FieldViewOption({ option }) {
  const isKeyValue = _.isPlainObject(option);

  return (
    <div>
      {
        isKeyValue ? (
            <Grid container spacing="1">
              <OptionField
                value={option.key}
                label="Label"
                {...{ fieldOptions }}
              />
              <OptionField
                value={option.value}
                label="Value"
                {...{ fieldOptions }}
              />
            </Grid>
          )
          :
          <Grid container spacing="1">
            <OptionField
              value={option}
              label="Label"
              {...{ fieldOptions }}
            />
          </Grid>
      }
    </div>
  );
}
