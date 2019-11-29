import _ from "lodash";
import React, { useCallback, useState, useMemo, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSnackbar } from "notistack";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  makeStyles,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Fade,
  LinearProgress
} from "@material-ui/core";

import { STATE_TYPES } from "blondie-platform-common";

import { setDraft } from "../actions/draft";
import useDraft from "../hooks/useDraft";
import useEntity from "../hooks/useEntity";
import useFirestore from "../hooks/useFirestore";
import useRouteParams from "../hooks/useRouteParams";
import Record from "../helpers/Record";
import countNonBlank from "../helpers/countNonBlank";
import CheckableFieldValue from "./CheckableFieldValue";

const useStyles = makeStyles(theme => ({
  dialogContent: {},
  actions: {
    display: "flex",
    justifyContent: "flex-end",
    paddingLeft: theme.spacing(2)
  },
  tableSection: {
    color: "#ccc"
  },
  tableHead: {
    "& th": {
      padding: "0 40px 0 16px",
      whiteSpace: "nowrap",

      "&:first-child": {
        padding: "0 0 0 4px"
      }
    }
  },
  tableRow: {
    "& td": {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      whiteSpace: "nowrap",
      textOverflow: "ellipsis"
    }
  },
  progressContainer: {
    width: "100%",
    display: "flex",
    justifyContent: "center"
  },
  progress: {
    margin: theme.spacing(2)
  },
  progressBar: {
    transitionDelay: "800ms"
  }
}));

export default function MergeDialog({
  configuration,
  popDialog,
  selected,
  setSelected
}) {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { entityId } = useRouteParams();
  const entity = useEntity(entityId);
  const firestore = useFirestore();
  const [orderedRecords, setOrderedRecords] = useState();
  const [loading, setLoading] = useState(false);
  const draft = useDraft(entityId, orderedRecords ? orderedRecords[0].id : "");
  const auth = useSelector(state => state.firebase.auth);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fn = async () => {
      const fieldIds = entity.fields.filtered.form.map(({ id }) => id);

      const selectedRecords = await Promise.all(
        _(selected).map(async id => {
          const doc = await firestore
            .collection("records")
            .doc(id)
            .get();
          return { id: doc.id, ...doc.data() };
        })
      );

      setOrderedRecords(
        _(selectedRecords)
          .orderBy(record => countNonBlank(record, fieldIds), "desc")
          .value()
      );
    };

    fn();
  }, [selected]);

  useEffect(() => {
    if (orderedRecords) {
      let draft = _.defaults(...orderedRecords)
      
      const orderedFormViewFields = entity.fields.filtered.form;
      orderedFormViewFields.forEach(field => {
        for (var i = 0; i < orderedRecords.length; i++) {
          const record = orderedRecords[i];
          if (record[field.id]) {
            draft[field.id] = record[field.id];
            break;
          }
        }
      });

      dispatch(setDraft(entityId, orderedRecords[0].id, draft));
    }
  }, [orderedRecords]);

  const sections = useMemo(() => {
    const orderedFormViewFields = entity.fields.filtered.form;

    const groupedFormViewFields = _.groupBy(
      orderedFormViewFields,
      field => field.section || ""
    );

    return _(groupedFormViewFields)
      .keys()
      .map(section => {
        const fields = _(orderedFormViewFields)
          .filter(s => (s.section || "") === section)
          .orderBy(field => parseInt(field.order))
          .value();

        return {
          section,
          fields,
          order: Math.min(
            ...fields.map(f => parseInt(f.order)).filter(f => !!f)
          )
        };
      })
      .filter(section => section.fields && section.fields.length > 0)
      .orderBy("order")
      .value();
  }, [entity]);

  const onMerge = useCallback(async () => {
    setLoading(true);

    const record = new Record(firestore, configuration, entityId, draft, auth);

    await record.save();

    await Promise.all(
      orderedRecords.map(async (record, index) => {
        if (index !== 0) {
          await firestore.update(`records/${record.id}`, {
            state: STATE_TYPES.DELETED
          });
        }
      })
    );

    setLoading(false);

    if (!_.isEmpty(record.errors)) {
      dispatch({
        type: actionTypes.DRAFT.ERRORS_SET,
        payload: { entityId, id: recordId || "new", errors: record.errors }
      });
    } else {
      let newSelected = [...selected];

      const deletedRecordIds = orderedRecords.map((record, index) => {
        if (index !== 0) return record.id;
      });

      newSelected = newSelected.filter(i => !deletedRecordIds.includes(i));
      setSelected(newSelected);

      enqueueSnackbar("Records has been merged successfully! Refreshing...", {
        variant: "success"
      });

      popDialog();
    }
  });

  return (
    <Dialog scroll="body" maxWidth="md" open onClose={popDialog}>
      <Fade in={loading} className={classes.progressBar}>
        <LinearProgress variant="query" />
      </Fade>
      <DialogTitle>Merge records</DialogTitle>
      <DialogContent className={classes.dialogContent}>
        {!orderedRecords ? (
          <div className={classes.progressContainer}>
            <CircularProgress className={classes.progress} />
          </div>
        ) : (
          <div className={classes.contentWrapper}>
            <Table className={classes.table}>
              <TableHead className={classes.tableHead}>
                <TableRow className={classes.tableRow}>
                  <TableCell>Fields</TableCell>
                  {orderedRecords &&
                    orderedRecords.map((record, index) => {
                      return (
                        <TableCell key={record.id}>
                          {"record" + (index + 1)}
                        </TableCell>
                      );
                    })}
                </TableRow>
              </TableHead>
              <TableBody>
                {sections &&
                  sections.map((section, index) => {
                    return (
                      <React.Fragment key={index}>
                        <TableRow className={classes.tableRow}>
                          <TableCell
                            padding="dense"
                            className={classes.tableSection}
                          >
                            {section.section || ""}
                          </TableCell>
                        </TableRow>
                        {section.fields &&
                          section.fields.map(field => {
                            return (
                              <TableRow
                                className={classes.tableRow}
                                key={field.id}
                              >
                                <TableCell>{field.name}</TableCell>
                                {orderedRecords &&
                                  orderedRecords.map(record => {
                                    return (
                                      <TableCell key={record.id}>
                                        <CheckableFieldValue
                                          primaryRecordId={
                                            orderedRecords[0].id || ""
                                          }
                                          {...{ entityId, record, field }}
                                        />
                                      </TableCell>
                                    );
                                  })}
                              </TableRow>
                            );
                          })}
                      </React.Fragment>
                    );
                  })}
              </TableBody>
            </Table>
          </div>
        )}
      </DialogContent>
      <DialogActions className={classes.actions}>
        <div>
          <Button onClick={popDialog}>Cancel</Button>
          <Button onClick={onMerge} color="primary">
            Merge
          </Button>
        </div>
      </DialogActions>
    </Dialog>
  );
}
