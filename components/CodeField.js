import React from "react";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import Switch from "@material-ui/core/Switch";
import Collapse from "@material-ui/core/Collapse";
import HelpIcon from "@material-ui/icons/Help";
import { withStyles, Button, FormHelperText } from "@material-ui/core";
import { compose } from "recompose";

let AceEditor = () => "";

if (typeof window !== "undefined") {
  require("brace");

  AceEditor = require("react-ace").default;

  require("brace/mode/javascript");
  require("brace/theme/textmate");
}

const styles = theme => ({
  control: {
    width: "100%"
  },
  label: {
    position: "static",
    marginBottom: theme.spacing(1)
  },
  editor: {
    minWidth: 200,
    position: "relative",
    overflow: "hidden",

    "& .ace_scroller": {
      borderRadius: "0 0 8px 8px !important"
    }
  },
  paper: {
    overflow: "hidden"
  },
  button: {
    flexShrink: 0,
    marginLeft: "auto",
    borderRadius: 0
  },
  tab: {
    display: "inline-flex",
    flexDirection: "row",
    alignItems: "center",

    "& svg": {
      fontSize: 16,
      marginLeft: theme.spacing(1)
    }
  },
  lightTooltip: {
    backgroundColor: "white",
    color: "rgba(0, 0, 0, 0.87)",
    boxShadow: theme.shadows[1],
    fontSize: 12,
    padding: theme.spacing(2),
    opacity: 1,
    maxWidth: "none",

    "& ul": {
      paddingLeft: theme.spacing(2)
    },

    "& ul li": {
      paddingBottom: theme.spacing(2),

      "&:last-child": {
        paddingBottom: 0
      }
    },

    "& code": {
      display: "inline-block",
      backgroundColor: theme.palette.grey[200],
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
      borderRadius: 5
    }
  },
  grid: {
    whiteSpace: "nowrap",
    marginBottom: theme.spacing(1),

    "&:last-child": {
      marginBottom: 0
    }
  },
  switch: {}
});

const DEFAULT_CODE_BASIC = `true`;

const DEFAULT_CODE_ADVANCED = `return true;`;

const DEFAULT_CODE = {
  basic: DEFAULT_CODE_BASIC,
  advanced: DEFAULT_CODE_ADVANCED
};

const DEFAULT_MODE = "basic";

function CodeField({ label, value, onChange, error, helperText, classes, ...props }) {
  const mode = value && value.mode;

  return (
    <>
      <FormControlLabel
        control={
          <Switch
            checked={!!mode}
            onChange={e => {
              onChange({
                target: { value: e.target.checked ? { ...value, mode: DEFAULT_MODE } : null }
              });
            }}
          />
        }
        label={label}
        className={classes.switch}
      />
      <Collapse in={!!mode}>
        <FormControl {...{ error }} className={classes.control}>
          <Paper className={classes.paper}>
            <Tabs
              variant="scrollable"
              value={mode || DEFAULT_MODE}
              indicatorColor="primary"
              textColor="primary"
              onChange={(e, v) => onChange({ target: { value: { ...value, mode: v } } })}
            >
              <Tab
                label={
                  <span className={classes.tab}>
                    Basic
                    <Tooltip
                      placement="top"
                      interactive
                      classes={{ tooltip: classes.lightTooltip }}
                      title={
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Basic expression
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            A simple type allows to enter arbitrary expressions in an Excel-like
                            way.
                          </Typography>
                          <br />
                          <Typography variant="body2" gutterBottom>
                            Numeric arithmetic
                          </Typography>
                          <Grid container spacing={1} className={classes.grid}>
                            <Grid item>
                              <code>x + y</code>
                            </Grid>
                            <Grid item>
                              <code>x - y</code>
                            </Grid>
                            <Grid item>
                              <code>x * y</code>
                            </Grid>
                            <Grid item>
                              <code>x / y</code>
                            </Grid>
                            <Grid item>
                              <code>x % y</code>
                            </Grid>
                            <Grid item>
                              <code>x ^ y</code>
                            </Grid>
                          </Grid>
                          <Typography variant="body2" gutterBottom>
                            Comparisons
                          </Typography>
                          <Grid container spacing={1} className={classes.grid}>
                            <Grid item>
                              <code>x == y</code>
                            </Grid>
                            <Grid item>
                              <code>{`x < y`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x <= y`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x > y`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x >= y`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x ~= y`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x in (a, b, c)`}</code>
                            </Grid>
                            <Grid item>
                              <code>{`x not in (a, b, c)`}</code>
                            </Grid>
                          </Grid>
                          <Typography variant="body2" gutterBottom>
                            Boolean logic
                          </Typography>
                          <Grid container spacing={1} className={classes.grid}>
                            <Grid item>
                              <code>x or y</code>
                            </Grid>
                            <Grid item>
                              <code>x and y</code>
                            </Grid>
                            <Grid item>
                              <code>not x</code>
                            </Grid>
                            <Grid item>
                              <code>x ? y : z</code>
                            </Grid>
                            <Grid item>
                              <code>( x )</code>
                            </Grid>
                          </Grid>
                          <Typography variant="body2" gutterBottom>
                            Built-in functions
                          </Typography>
                          <Grid container spacing={1} className={classes.grid}>
                            <Grid item>
                              <code>abs(x)</code>
                            </Grid>
                            <Grid item>
                              <code>ceil(x)</code>
                            </Grid>
                            <Grid item>
                              <code>floor(x)</code>
                            </Grid>
                            <Grid item>
                              <code>log(x)</code>
                            </Grid>
                            <Grid item>
                              <code>max(a, b, c...)</code>
                            </Grid>
                            <Grid item>
                              <code>min(a, b, c...)</code>
                            </Grid>
                            <Grid item>
                              <code>random()</code>
                            </Grid>
                            <Grid item>
                              <code>round(x)</code>
                            </Grid>
                            <Grid item>
                              <code>sqrt(x)</code>
                            </Grid>
                          </Grid>
                        </>
                      }
                    >
                      <HelpIcon fontSize="10px" />
                    </Tooltip>
                  </span>
                }
                value="basic"
              />
              <Tab
                label={
                  <span className={classes.tab}>
                    Advanced
                    <Tooltip
                      placement="top"
                      interactive
                      classes={{ tooltip: classes.lightTooltip }}
                      title={
                        <>
                          <Typography variant="subtitle2" gutterBottom>
                            Advanced expression
                          </Typography>
                          <Typography variant="body2" gutterBottom>
                            An advanced type allows to enter Javascript-based expressions in ES6
                            mode.
                          </Typography>
                          <Typography variant="body2">
                            You're free to use any valid Javascript code here, but you must always
                            explicitly return a value as you would from a function.
                          </Typography>
                        </>
                      }
                    >
                      <HelpIcon fontSize="10px" />
                    </Tooltip>
                  </span>
                }
                value="advanced"
              />
              <Button
                color="primary"
                className={classes.button}
                onClick={() => onChange({ target: { value: { mode, ...DEFAULT_CODE } } })}
              >
                Revert to default
              </Button>
            </Tabs>
            <Divider light />
            <AceEditor
              className={classes.editor}
              mode="javascript"
              theme="textmate"
              {...props}
              tabSize={2}
              width="100%"
              height="200px"
              value={
                !value || typeof value[mode] === "undefined" ? DEFAULT_CODE[mode] : value[mode]
              }
              enableBasicAutocompletion
              enableLiveAutocompletion
              onChange={v => onChange({ target: { value: { ...value, [mode]: v } } })}
              onLoad={editor => {
                editor.session.$worker.send("changeOptions", [{ asi: true }]);
              }}
            />
          </Paper>
          {helperText && <FormHelperText>{helperText}</FormHelperText>}
        </FormControl>
      </Collapse>
    </>
  );
}

export default compose(withStyles(styles))(CodeField);
