import React from "react";
import withStyles from "@material-ui/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import Badge from "@material-ui/core/Badge";
import Slider from "@material-ui/lab/Slider";
import Box from "@material-ui/core/Box";
import {
  KeyboardDatePicker,
  KeyboardDateTimePicker,
  KeyboardTimePicker
} from "@material-ui/pickers";
import CallIcon from "@material-ui/icons/Call";
import ChatIcon from "@material-ui/icons/Chat";
import EmailIcon from "@material-ui/icons/Email";
import WebIcon from "@material-ui/icons/OpenInNew";
import MapIcon from "@material-ui/icons/Map";

import EntitySelector from "containers/EntitySelector";
import CodeField from "components/CodeField";
import FIELD_TYPES from "../constants/fieldTypes";
import UploadField from "../containers/UploadField";
import GoogleDocsSelector from "../containers/GoogleDocsSelector";
import IconSelector from "../containers/IconSelector";
import ColorSelector from "../containers/ColorSelector";

import Calculatable from "./Calculatable";

if (typeof window !== "undefined") {
  require("brace");
  const editor = require("react-ace");
  var AceEditor = editor.default;
  require("brace/mode/graphqlschema");
  require("brace/theme/dracula");
}

const styles = theme => ({
  badge: {
    width: "100%"
  },
  "@keyframes pulse": {
    "0%": {
      boxShadow: "0 0 0 0 rgba(119, 73, 255, 0.4)"
    },
    "70%": {
      boxShadow: "0 0 0 5px rgba(119, 73, 255, 0)"
    },
    "100%": {
      boxShadow: "0 0 0 0 rgba(119, 73, 255, 0)"
    }
  },
  pulse: {
    "& > span": {
      animation: "1s $pulse",
      animationIterationCount: "infinite"
    }
  },
  warning: {
    "& > span": {
      backgroundColor: "#ffc400"
    }
  },
  card: {
    minWidth: 275
  },
  title: {
    fontSize: 10
  },
  slider: {
    height: "100%",
    marginBottom: "20px",
    padding: "0 20px"
  }
});

const StyledBadge = withStyles(theme => ({
  badge: {
    top: 7,
    right: 7
  }
}))(Badge);

const StyledTooltip = withStyles(theme => ({
  tooltip: {
    background: "none",
    padding: 0,
    boxShadow: "none"
  }
}))(Tooltip);

class FormField extends React.Component {
  renderOptions(options) {
    return options.map(option => {
      const { label, value } = _.isPlainObject(option) ? option : { label: option, value: option };

      return (
        <MenuItem key={value || "none"} value={value}>
          {label}
        </MenuItem>
      );
    });
  }

  getHelperText = () => {
    const { error, fieldError } = this.props;

    return error || fieldError || null;
  };

  render() {
    const {
      classes,
      platformId,
      entityId,
      parentEntityId,
      orderedTitleFields,
      fieldValue,
      fullWidth,
      autoFocus,
      margin = "dense",
      variant = "standard",
      shrink,
      dense,
      fieldError,
      calculation,
      field: {
        id: fieldId,
        type: fieldType,
        relation,
        name: label,
        required,
        actions,
        prefix,
        suffix
      },
      onChangeHandler,
      value,
      valueMutate,
      error,
      InputProps,
      other
    } = this.props;

    const type = (fieldType && fieldType.type) || (relation ? "entity" : "string");
    const options = this.props.options || (fieldType && fieldType.options);

    let { readOnly } = this.props;

    if (typeof readOnly !== "undefined") {
      readOnly = typeof readOnly === "function" ? readOnly({ [fieldId]: fieldValue }) : readOnly; // TODO: use complete draft here
    }

    const defaultValue =
      typeof valueMutate === "function"
        ? valueMutate(fieldValue)
        : fieldValue || (type === "multiselect" ? [] : "");

    let actualValue = _.isEmpty(value && value.toString()) ? defaultValue : value;

    if (_.isUndefined(actualValue)) {
      actualValue = null;
    }

    const inputProps = {
      startAdornment: prefix && (
        <InputAdornment position="start">
          {_.isString(prefix) ? (
            <Typography variant="body2" color="textSecondary" noWrap>
              {prefix}
            </Typography>
          ) : (
            prefix
          )}
        </InputAdornment>
      ),
      endAdornment: suffix && (
        <InputAdornment position="end">
          {_.isString(suffix) ? (
            <Typography variant="body2" color="textSecondary" noWrap>
              {suffix}
            </Typography>
          ) : (
            suffix
          )}
        </InputAdornment>
      ),
      readOnly,
      margin,
      ...InputProps
    };

    const inputLabelProps = {
      shrink: shrink === true || readOnly || !!actualValue ? true : undefined
    };

    if (actualValue && actions && actions.ordered.length > 0) {
      inputProps.endAdornment = (
        <InputAdornment position="end">
          {actions.ordered.map(action => {
            return (
              <Tooltip key={action.id} title={action.name}>
                <IconButton href={action.url.replace("{{value}}", actualValue)} target="_blank">
                  {
                    {
                      phone: <CallIcon fontSize="small" />,
                      chat: <ChatIcon fontSize="small" />,
                      email: <EmailIcon fontSize="small" />,
                      url: <WebIcon fontSize="small" />,
                      map: <MapIcon fontSize="small" />
                    }[action.iconType]
                  }
                </IconButton>
              </Tooltip>
            );
          })}
        </InputAdornment>
      );
    }

    const defaultLabelOptions = {
      key: fieldId,
      fullWidth,
      label,
      margin,
      required,
      autoFocus,
      helperText: this.getHelperText(),
      error: !!(error || fieldError),
      InputLabelProps: inputLabelProps
    };

    const defaultInputOptions = {
      value: actualValue,
      onChange: onChangeHandler,
      InputProps: inputProps
    };

    const defaultOptions = {
      ...defaultLabelOptions,
      ...defaultInputOptions,
      variant,
      dense,
      focusable: !readOnly
    };

    const defaultDateTimeOptions = {
      ...defaultOptions,
      value: defaultOptions.value.toDate ? defaultOptions.value.toDate() : defaultOptions.value,
      autoOk: true,
      clearable: true,
      ampm: false,
      variant: "inline",
      inputVariant: defaultOptions.variant,
      // InputLabelProps: undefined,
      InputAdornmentProps: { position: "end" },
      style: readOnly ? { pointerEvents: "none" } : {},
      format: "dd.MM.yyyy HH:mm"
    };

    const defaultDateOptions = {
      ...defaultDateTimeOptions,
      format: "dd/MM/yyyy"
    };

    const defaultTimeOptions = {
      ...defaultDateTimeOptions,
      format: "HH:mm"
    };

    let children;

    switch (type) {
      case FIELD_TYPES.CODE:
        children = <CodeField {...defaultOptions} />;
        break;

      case FIELD_TYPES.DATE:
        children = <KeyboardDatePicker {...defaultDateOptions} />;
        break;

      case FIELD_TYPES.TIME:
        children = <KeyboardTimePicker {...defaultTimeOptions} />;
        break;

      case FIELD_TYPES.DATE_TIME:
        children = <KeyboardDateTimePicker {...defaultDateTimeOptions} />;
        break;

      case FIELD_TYPES.SLIDER:
        children = (
          <FormControl key={fieldId} {...{ fullWidth, margin }} className={classes.slider}>
            <InputLabel htmlFor="select-multiple-checkbox" shrink>
              {label}
            </InputLabel>
            <Box width="100%" height="100%" display="flex" alignItems="flex-end">
              <Slider
                value={defaultOptions.value || 0}
                valueLabelDisplay="auto"
                step={1}
                min={0}
                max={12}
                marks={[
                  { value: 0, label: "Auto" },
                  { value: 3, label: "25%" },
                  { value: 6, label: "50%" },
                  { value: 9, label: "75%" },
                  { value: 12, label: "Full" }
                ]}
                onChange={(e, newValue) => defaultOptions.onChange({ target: { value: newValue } })}
              />
            </Box>
          </FormControl>
        );
        break;

      case FIELD_TYPES.BOOLEAN:
        children = (
          <FormControlLabel
            {...defaultLabelOptions}
            control={
              <Checkbox
                {...defaultInputOptions}
                color="primary"
                checked={actualValue}
                onChange={e => onChangeHandler(e.target.checked)}
              />
            }
          />
        );
        break;

      case FIELD_TYPES.MULTISELECT:
        const newOptions = typeof options === "function" ? options({ ...other, actions }) : options;
        children = (
          <FormControl key={fieldId} {...{ fullWidth, margin }}>
            <InputLabel htmlFor="select-multiple-checkbox">{label}</InputLabel>
            <Select
              {...{
                fullWidth,
                autoFocus,
                label,
                margin,
                required,
                readOnly
              }}
              multiple
              value={actualValue}
              onChange={onChangeHandler}
              error={!!(error || fieldError)}
              input={<Input id="select-multiple-checkbox" />}
              disableUnderline={readOnly}
              renderValue={
                selected =>
                  selected
                    .map(s => {
                      const opt = newOptions.find(o => o.value === s);
                      return opt && opt.label;
                    })
                    .join(", ")
                // (
                //   other.listView ? other.listView(selected, { ...other, actions }) : selected
                // )
                // .join(", ")
              }
            >
              {newOptions.map(({ label, value }) => (
                <MenuItem key={value} value={value}>
                  <Checkbox checked={actualValue.indexOf(value) > -1} />
                  <ListItemText primary={label} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        break;

      case FIELD_TYPES.ENTITY:
        children = (
          <EntitySelector
            {...defaultOptions}
            shrink={shrink}
            readOnly={readOnly}
            options={options}
            entityId={entityId}
            parentEntityId={parentEntityId}
            orderedTitleFields={orderedTitleFields}
          />
        );
        break;

      case FIELD_TYPES.GRAPHQL_SCHEME:
        children = (
          <AceEditor
            {...defaultOptions}
            mode="graphqlschema"
            theme="textmate"
            json="json"
            enableBasicAutocompletion={true}
            enableLiveAutocompletion={true}
            width="100%"
          />
        );
        break;

      case FIELD_TYPES.CSV_UPLOAD:
        children = (
          <UploadField
            {...defaultOptions}
            onChangeHandler={onChangeHandler}
            readOnly={readOnly}
            fileCount={1}
            accept={"text/csv"}
            fileDropText={other.fileDropText}
            files={actualValue}
            showFiles={other.showFiles}
          />
        );
        break;

      case FIELD_TYPES.GOOGLE_DOCS_FOLDER:
        children = <GoogleDocsSelector {...defaultOptions} viewId="FOLDERS" />;
        break;

      case FIELD_TYPES.GOOGLE_DOCS_FILE:
        children = <GoogleDocsSelector {...defaultOptions} viewId="DOCUMENTS" />;
        break;

      case FIELD_TYPES.ICON:
        children = <IconSelector {...defaultOptions} />;
        break;

      case FIELD_TYPES.COLOR:
        children = <ColorSelector {...defaultOptions} />;
        break;

      case FIELD_TYPES.TEXT:
        children = <TextField {...defaultOptions} multiline />;
        break;

      default:
        children = (
          <TextField {...defaultOptions} select={type === FIELD_TYPES.SELECT}>
            {type === FIELD_TYPES.SELECT &&
              this.renderOptions(typeof options === "function" ? options(other) : options)}
          </TextField>
        );
        break;
    }

    return (
      <Calculatable
        {...{ platformId, type: fieldType, calculation, value: actualValue, onChangeHandler }}
      >
        {children}
      </Calculatable>
    );
  }
}

export default withStyles(styles)(FormField);
