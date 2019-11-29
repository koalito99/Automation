import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import MenuItem from "@material-ui/core/MenuItem";
import { withStyles, Typography } from "@material-ui/core";
import FormField from "../FormField";
import Loading from "../Loading";

const styles = theme => ({
  root: {
    "& > div > div": {
      width: "100%"
    }
  },
  forceLeft: {
    flexGrow: 1
  },
  error: {
    color: "#ff0000"
  }
});

export default withStyles(styles)(
  ({
    isOpened,
    draft,
    errors,
    sourceDefinition,
    onChangeHandler,
    onSubmitHandler,
    onCancelHandler,
    classes,
    isLoading
  }) => (
    <>
      <Dialog
        className={classes.root}
        open={isOpened}
        onClose={onCancelHandler}
        maxWidth="md"
        aria-labelledby="form-dialog-title"
      >
        <form onSubmit={onSubmitHandler}>
          <DialogTitle id="form-dialog-title">{sourceDefinition.title} import</DialogTitle>
          <DialogContent>
            {sourceDefinition &&
              sourceDefinition.importSchema.map((field, index) => (
                <FormField
                  other={field}
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
                  values={draft}
                  onChangeHandler={
                    field.onChangeHandler
                      ? field.onChangeHandler(onChangeHandler, draft)
                      : onChangeHandler(field.name)
                  }
                >
                  {field.options &&
                    field.options.map(option => (
                      <MenuItem key={option.value || option} value={option.value || option}>
                        {option.label || option}
                      </MenuItem>
                    ))}
                </FormField>
              ))}
            {isLoading && <Loading />}
          </DialogContent>
          <DialogActions>
            <Button onClick={onCancelHandler} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" color="primary" disabled={isLoading}>
              Import
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  )
);
