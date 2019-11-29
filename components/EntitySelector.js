import { useCallback, useMemo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import classNames from "classnames";
import Select from "react-select";
import { makeStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import NoSsr from "@material-ui/core/NoSsr";
import TextField from "@material-ui/core/TextField";
import Paper from "@material-ui/core/Paper";
import Chip from "@material-ui/core/Chip";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import CancelIcon from "@material-ui/icons/Cancel";
import SearchIcon from "@material-ui/icons/Search";
import { emphasize } from "@material-ui/core/styles/colorManipulator";
import { Highlight } from "react-instantsearch-dom";
import { connectAutoComplete } from "react-instantsearch-core";
import useConfiguration from '../hooks/useConfiguration';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
    height: 250
  },
  input: {
    display: "flex",
    padding: 0,
    height: "auto"
  },
  valueContainer: {
    display: "flex",
    flexWrap: "nowrap",
    flex: 1,
    alignItems: "center",
    overflow: "hidden",
    minHeight: 32
  },
  chip: {
    margin: `${theme.spacing(0.5)}px ${theme.spacing(0.25)}px`
  },
  chipFocused: {
    backgroundColor: emphasize(
      theme.palette.type === "light" ? theme.palette.grey[300] : theme.palette.grey[700],
      0.08
    )
  },
  noOptionsMessage: {
    padding: `${theme.spacing(1)}px ${theme.spacing(1)}px`
  },
  singleValue: {
    fontSize: 16,
    lineHeight: "19px",
    height: 19,
    whiteSpace: "nowrap"
  },
  outlined: {
    padding: "0 14px",

    "div&": {
      minHeight: 56
    }
  },
  placeholder: {
    position: "relative",
    left: 2,
    fontSize: 16,
    height: 19
  },
  paper: {
    position: "absolute",
    zIndex: 2,
    marginTop: theme.spacing(1),
    left: 0,
    right: 0
  },
  divider: {
    height: theme.spacing(2)
  },
  menuItem: {
    "& .ais-Highlight-highlighted": {
      fontStyle: "normal",
      backgroundColor: "yellow"
    }
  },
  dot: {
    marginLeft: theme.spacing(0.5),
    marginRight: theme.spacing(0.5)
  }
}));

function NoOptionsMessage(props) {
  return (
    <Typography
      color="textSecondary"
      className={props.selectProps.classes.noOptionsMessage}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function inputComponent({ inputRef, ...props }) {
  return <div ref={inputRef} {...props} />;
}

function Control(props) {
  const InputProps = {
    inputComponent,
    inputProps: {
      className: props.selectProps.classes.input,
      inputRef: props.innerRef,
      children: props.children,
      ...props.innerProps
    }
  };

  return (
    <TextField
      fullWidth
      {...{ InputProps }}
      {...props.selectProps.textFieldProps}
    />
  );
}

function Option(props) {
  const { innerRef, isFocused, selectProps, innerProps, children: option, isSelected } = props;
  const style = useMemo(() => ({
    fontWeight: isSelected ? 500 : 400
  }), [isSelected]);

  return (
    <MenuItem
      buttonRef={innerRef}
      selected={isFocused}
      component="div"
      {...{ style }}
      {...innerProps}
      className={selectProps.classes.menuItem}
    >
      {
        (option._highlightResult && option._highlightResult.primary)
          ? <Highlight hit={option} attribute='primary' />
          : option.primary
      }
    </MenuItem>
  );
}

function Placeholder(props) {
  return (
    <Typography
      color="textSecondary"
      className={classNames(props.selectProps.classes.placeholder, {
        [props.selectProps.classes.outlined]:
        props.selectProps.textFieldProps.variant === "outlined"
      })}
      {...props.innerProps}
    >
      {props.children}
    </Typography>
  );
}

function SingleValue(props) {
  return (
    <Typography className={classNames(props.selectProps.classes.singleValue)} {...props.innerProps}>
      {props.children.primary}
    </Typography>
  );
}

function ValueContainer(props) {
  return (
    <div
      className={classNames(
        props.selectProps.classes.placeholder,
        props.selectProps.classes.valueContainer,
        {
          [props.selectProps.classes.outlined]:
          props.selectProps.textFieldProps.variant === "outlined"
        }
      )}
    >
      {props.children}
    </div>
  );
}

function MultiValue(props) {
  return (
    <Chip
      tabIndex={-1}
      label={props.children}
      className={classNames(props.selectProps.classes.chip, {
        [props.selectProps.classes.chipFocused]: props.isFocused
      })}
      onDelete={props.removeProps.onClick}
      deleteIcon={<CancelIcon {...props.removeProps} />}
    />
  );
}

function Menu(props) {
  return (
    <Paper square className={props.selectProps.classes.paper} {...props.innerProps}>
      {props.children}
    </Paper>
  );
}

const components = {
  Control,
  Menu,
  MultiValue,
  NoOptionsMessage,
  Option,
  Placeholder,
  SingleValue,
  ValueContainer
};

function EntitySelector(props) {
  const {
    hits,
    defaultRefinement,
    currentRefinement,
    refine,
    label,
    value,
    variant,
    required,
    helperText,
    error,
    margin,
    multiple,
    theme,
    onChange: triggerChange,
    isClearable = true,
    searchClient,
    entities,
    autoFocus
  } = props;
  const classes = useStyles();
  const [indexes, setIndexes] = useState([]);
  const [selectedOption, setSelectedOption] = useState();
  const configuration = useConfiguration();

  const styles = useMemo(() => {
    input: base => ({
      ...base,
      color: theme.palette.text.primary,
      "& input": {
        font: "inherit"
      }
    });
  }, []);

  useEffect(() => {
    const fn = async () => {
      let algolias = indexes;

      if (!indexes.length) {
        algolias = await Promise.all(entities.map(async (entity) => {
          return searchClient.initIndex(entity.id);
        }));

        setIndexes(algolias);
      }

      const records = await Promise.all(algolias.map(async (algolia) => {
        try {
          const res = await algolia.getObject(value);

          return res;
        } catch (e) {
          // skip because object was not found
        }
      }));

      const filteredRecords = records.filter(i => !!i);
      const record = _.first(filteredRecords);

      if (record) {
        setSelectedOption({ label: record, value });
      }
    };

    fn();
  }, [value]);

  let options = useMemo(() => {
    if (entities.length > 1) {
      return hits && hits.map((result) => {
        return {
          entityId: result.index,
          label: configuration.entities.data[result.index].name,
          options: result.hits.map(hit => ({
            label: hit,
            value: hit.objectID
          }))
        };
      });
    }

    return hits &&
      hits.map(hit => ({
        label: hit,
        value: hit.objectID
      }));
  }, [hits]);

  if (selectedOption) {
    if (entities.length > 1) {
      const index = _.findIndex(options, (grouped) => {
        return grouped.entityId === selectedOption.label.entity;
      });

      options[index] = { ...options[index], options: _.uniqBy([selectedOption, ...options[index].options], 'id') };
    } else {
      options.unshift(selectedOption);
    }
  }

  const currentOption = entities.length > 1
    ? options
      .reduce((acc, opt) => [...acc, ...opt.options], [])
      .find(option => option.value === value)
    : options
      .find(option => option.value === value);

  const onChange = useCallback(option => triggerChange({ target: { value: option && option.value } }), []);
  const onInputChange = useCallback(option => refine(option), []);
  const filterOption = useCallback(() => true, []);
  const textFieldProps = useMemo(() => ({
    label,
    margin,
    error,
    required,
    variant,
    helperText,
    InputLabelProps: {
      shrink: true
    }
  }), []);

  const inputProps = useMemo(() => ({
    endAdornment: (
      <InputAdornment position="end">
        <SearchIcon fontSize="small" />
      </InputAdornment>
    )
  }), []);

  return (
    <NoSsr>
      <Select
        {...{
          classes,
          styles,
          options,
          components,
          isClearable,
          onChange,
          onInputChange,
          textFieldProps,
          filterOption,
          inputProps,
          autoFocus
        }}
        value={currentOption}
        inputValue={currentRefinement}
        placeholder=""
        isMulti={multiple}
      />
    </NoSsr>
  );
}

export default connectAutoComplete(EntitySelector);
