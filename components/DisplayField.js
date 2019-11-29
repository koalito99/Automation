import React from "react";
import moment from "moment";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Input from "@material-ui/core/Input";
import FormHelperText from "@material-ui/core/FormHelperText";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import MenuItem from "@material-ui/core/MenuItem";
import InputAdornment from "@material-ui/core/InputAdornment";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import CallIcon from "@material-ui/icons/Call";
import ChatIcon from "@material-ui/icons/Chat";
import EmailIcon from "@material-ui/icons/Email";
import WebIcon from "@material-ui/icons/OpenInNew";
import MapIcon from "@material-ui/icons/Map";
import FIELD_TYPES from "../constants/fieldTypes";

import { Link as RouterLink } from "../routes";
import EntityTitle from "../containers/EntityTitle";
import Calculatable from "./Calculatable";

if (typeof window !== "undefined") {
  require("brace");
  const editor = require("react-ace");
  var AceEditor = editor.default;
  require("brace/mode/graphqlschema");
  require("brace/theme/dracula");
}

class FormField extends React.Component {
  renderOptions(options) {
    return options.map(option => {
      const { label, value } = _.isPlainObject(option) ? option : { label: option, value: option };

      return (
        <MenuItem key={value} value={value}>
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
      platformId,
      entityId,
      orderedTitleFields,
      fieldValue,
      fullWidth,
      margin = "dense",
      variant = "standard",
      calculation,
      fieldError,
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
      value,
      valueMutate,
      error,
      InputProps
    } = this.props;

    const type = (fieldType && fieldType.type) || (relation ? "entity" : "string");

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

    let formattedValue = actualValue;

    switch (type) {
      case FIELD_TYPES.DATE:
        formattedValue = formattedValue && moment(formattedValue).format("DD.MM.YYYY");
        break;

      case FIELD_TYPES.TIME:
        formattedValue = formattedValue && moment(formattedValue).format("HH:mm");
        break;

      case FIELD_TYPES.DATE_TIME:
        formattedValue = formattedValue && moment(formattedValue).format("DD.MM.YYYY HH:mm");
        break;

      case FIELD_TYPES.BOOLEAN:
        formattedValue = formattedValue ? "Yes" : "No";
        break;

      case FIELD_TYPES.TEXT:
        formattedValue =
          formattedValue &&
          formattedValue.split(/\r?\n/).map((s, index) => (
            <Typography
              variant="body2"
              gutterBottom={index < formattedValue.split(/\r?\n/).length - 1}
            >
              {s}
            </Typography>
          ));
        break;

      case FIELD_TYPES.ENTITY:
        formattedValue = formattedValue && (
          <RouterLink route="resource" params={{ platformId, entityId, id: formattedValue }}>
            <Link>
              <EntityTitle {...{ entityId, value: formattedValue, orderedTitleFields }} />
            </Link>
          </RouterLink>
        );
        break;
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

    if (formattedValue && actions && actions.ordered.length > 0) {
      inputProps.endAdornment = (
        <InputAdornment position="end">
          {actions.ordered.map(action => {
            return (
              <Tooltip key={action.id} title={action.name}>
                <IconButton href={action.url.replace("{{value}}", formattedValue)} target="_blank">
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
      margin,
      required,
      variant,
      error: !!(error || fieldError),
      shrink: true
    };

    const defaultInputOptions = {
      readOnly: true,
      required,
      margin,
      fullWidth,
      error: !!(error || fieldError),
      value: formattedValue,
      multiline: type === FIELD_TYPES.TEXT,
      ...inputProps
    };

    const defaultFormControlOptions = {
      fullWidth,
      error: !!(error || fieldError),
      margin,
      required,
      variant
    };

    const helperText = this.getHelperText();

    return (
      <Calculatable {...{ platformId, type: fieldType, calculation, value: actualValue }}>
        <FormControl {...defaultFormControlOptions}>
          <InputLabel htmlFor={fieldId} {...defaultLabelOptions}>
            {label}
          </InputLabel>
          <Input
            id={fieldId}
            {...defaultInputOptions}
            inputComponent={({ value, className }) => (
              <div
                {...{ className }}
                style={{
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  overflow: "hidden",
                  minHeight: "1.1875em"
                }}
              >
                {value}
              </div>
            )}
          />
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </Calculatable>
    );
  }
}

export default FormField;
