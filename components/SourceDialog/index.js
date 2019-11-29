import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { makeStyles } from "@material-ui/core";
import FormField from "../../components/FormField";

const useStyles = makeStyles(theme => ({
  root: {
    "& > div > div": {
      width: "100%"
    }
  },
  forceLeft: {
    flexGrow: 1
  }
}));

export default ({ isOpened, source, onChangeHandler, onSubmitHandler, onCancelHandler, configuration, draft }) => {
  const classes = useStyles();

  return !source ? (
    ""
  ) : (
    <Dialog
      className={classes.root}
      open={isOpened}
      onClose={onCancelHandler}
      maxWidth="md"
      aria-labelledby="form-dialog-title"
    >
      <form onSubmit={onSubmitHandler}>
        <DialogTitle id="form-dialog-title">Enable {source.title} source</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To enable {source.title} source, please enter your credentials.
          </DialogContentText>
          {source &&
          source.schema.map((field, index) => (
            <FormField
              key={field.name}
              field={{
                ...field,
                id: field.name,
                name: field.label,
                type: {
                  type: field.type
                }
              }}
              autoFocus={index === 0}
              fullWidth
              margin="normal"
              select={field.type === "select"}
              multiline={field.type === "text"}
              onChangeHandler={
                field.onChangeHandler
                  ? field.onChangeHandler(onChangeHandler, draft)
                  : onChangeHandler(field.name)
              }
              onChangeMutate={field.onChangeMutate}
              valueMutate={field.valueMutate}
              value={draft[field.name]}
              options={field.options}
              other={{ configuration }}
            />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={onCancelHandler}>Cancel</Button>
          <Button type="submit" color="primary">
            Enable
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
