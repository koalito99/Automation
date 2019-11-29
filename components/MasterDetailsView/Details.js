import React, { useCallback, useState, useEffect, Fragment } from "react";
import { useDispatch } from "react-redux";
import { useSnackbar } from "notistack";
import { withStyles } from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import Slide from "@material-ui/core/Slide";
import Hidden from "@material-ui/core/Hidden";
import { useTheme } from "@material-ui/core/styles";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { setDraft, setErrors } from "../../actions/draft";
import Mustaches from "blondie-inc-google-docs-mustaches";
import { runCode, RecordContext } from "blondie-platform-common";
import * as dateFns from "date-fns";

import RelatedLists from "components/RelatedLists";
import RelatedWidgets from "containers/RelatedWidgets";
import IndexingSnackbar from "containers/IndexingSnackbar";
import RecordFileUploadDropzone from "containers/RecordFileUploadDropzone";
import BackButton from "../BackButton";
import EditButton from "../EditButton";
import DeleteButton from "../DeleteButton";
import CancelButton from "../CancelButton";
import SaveButton from "../SaveButton";
import ActionButton from "./ActionButton";
import ActionsSection from "./ActionsSection";
import useFirestore from "../../hooks/useFirestore";
import useConfiguration from "../../hooks/useConfiguration";
import useRouteName from "../../hooks/useRouteName";
import useRouteParams from "../../hooks/useRouteParams";
import useDraft from "../../hooks/useDraft";
import useAuth from "../../hooks/useAuth";
import Record from "../../helpers/Record";

import ResourceDetailsTabs from "../../containers/ResourceDetailsTabs";
import ResourceFileList from "../../components/ResourceFileList";
import RecordForm from "../../components/RecordForm";
import CloneButton from "../CloneButton";

import { Router } from "../../routes";
import Breadcrumbs from "../Breadcrumbs";
import { STATE_TYPES } from "blondie-platform-common";
import goToPreviousRecord from "../../helpers/goToPreviousRecord";
import useEntity from "../../hooks/useEntity";
import useBlondieFlowTriggerAction from '../../hooks/useBlondieFlowTriggerAction';
import GoogleAPIs from '../GoogleAPIs';

const styles = theme => ({
  appBar: {
    padding: theme.spacing(2)
  },
  bottomBar: {},
  bottomBarStatic: {
    left: 0,
    bottom: 0,
    position: "absolute",
    boxShadow: "none",
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1)
  },
  bottomBarFixed: {
    top: "auto",
    bottom: 0,
    left: 0,
    width: "100vw",
    padding: theme.spacing(3),
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),

    [theme.breakpoints.up("lg")]: {
      left: 300,
      width: "calc(100vw - 300px)"
    }
  },
  icon: {
    width: 53,
    height: 53,
    backgroundColor: theme.palette.primary.main
  },
  fabs: {
    position: "absolute",
    bottom: -27,
    right: theme.spacing(4),
    zIndex: 1
  },
  fab: {
    marginLeft: theme.spacing(1)
  },
  action: {
    marginRight: -12
  },
  actions: {
    paddingTop: theme.spacing(3),
    display: "flex",
    justifyContent: "space-between",
    "& button": {
      marginLeft: theme.spacing(2),
      "&:first-child": {
        marginLeft: 0
      }
    }
  },
  iframe: {
    border: "none",
    height: 400,
    width: "calc(100% + 32px * 2)",
    margin: "-32px -32px 22px -32px",
    borderBottom: "1px solid rgba(0, 0, 0, 0.12)"
  },
  paperQuick: {
    paddingBottom: 64
  },
  secondaryToolbar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    padding: 4
  }
});

const EditControls = ({ onSave }) => (
  <Fragment>
    <Grid item>
      <CancelButton />
    </Grid>
    <Grid item>
      <SaveButton {...{ onSave }} />
    </Grid>
  </Fragment>
);

function Details({ classes }) {
  const dispatch = useDispatch();
  const [token, setToken] = useState();
  const configuration = useConfiguration();
  const firestore = useFirestore();
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const routeName = useRouteName();
  const { platformId, entityId, id, view, path } = useRouteParams();
  const entity = useEntity(entityId);
  const editMode =
    ["resourceNew", "resourceEdit"].includes(routeName) || id === "new";
  const theme = useTheme();
  const mobile = useMediaQuery(theme.breakpoints.down("xs"));
  const draft = useDraft(entityId, id);
  const auth = useAuth();
  const handleBlondieFlowTriggerAction = useBlondieFlowTriggerAction();

  const hasRelations =
    entity.sourceRelations.filtered.many.length > 0 ||
    entity.sourceRelations.filtered.one.length > 0 ||
    entity.targetRelations.filtered.many.length > 0 ||
    entity.targetRelations.filtered.one.length > 0;

  const hasWidgets = entity.widgets.ordered.length > 0;

  const groupedActions =
    !entity.actions.isEmpty &&
    _.groupBy(entity.actions.ordered, ({ section }) => section || "");

  useEffect(() => {
    const fn = async () => {
      let draft = {};

      if (id && id !== "new") {
        const doc = await firestore
          .collection("records")
          .doc(id)
          .get();
        draft = { id: doc.id, ...doc.data() };
      }

      dispatch(setDraft(entityId, id, draft));
    };

    fn();

    return () => {
      if (id === "new") {
        dispatch(setDraft(entityId, id, {}));
      }
    };
  }, [entityId, id]);

  const onSnapshot = useCallback(
    doc => {
      const draft = { id: doc.id, ...doc.data() };
      dispatch(setDraft(entityId, id, draft));
    },
    [entityId, id]
  );

  useEffect(() => {
    if (id && id !== "new") {
      firestore.setListener({ collection: "records", doc: id }, onSnapshot);
    }

    return () => {
      if (id && id !== "new") {
        firestore.unsetListener({ collection: "records", doc: id });
      }
    };
  }, [entityId, id]);

  const onCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    } else {
      Router.pushRoute("resource", { platformId, entityId, id, view, path });
    }
  }, [platformId, entityId, id, view]);

  const onSave = useCallback(
    async e => {
      e.preventDefault();

      const snackbar = enqueueSnackbar(
        `Saving ${entity.name.toLowerCase()}...`,
        { persist: true }
      );

      const attrs = { ...draft };
      if (id !== "new") {
        attrs.id = id;
      }

      const record = new Record(
        firestore,
        configuration,
        entityId,
        attrs,
        auth
      );

      try {
        await record.save();

        if (!_.isEmpty(record.errors)) {
          dispatch(setErrors(entityId, id, record.errors));
          closeSnackbar(snackbar);
          enqueueSnackbar(
            `There are validation errors in your ${entity.name.toLowerCase()}. Please, fix them and try again.`,
            { variant: "error" }
          );
          return;
        }

        enqueueSnackbar(`Indexing ${entity.name.toLowerCase()}...`);

        Router.pushRoute("resource", {
          platformId,
          entityId,
          id: record.attrs.id,
          view,
          path
        });
      } catch (e) {
        console.error(e);
      }

      closeSnackbar(snackbar);
    },
    [platformId, entityId, id, draft]
  );

  const onDelete = useCallback(async () => {
    firestore.update(`records/${id}`, { state: STATE_TYPES.DELETED });

    if (path) {
      return goToPreviousRecord({ path, firestore, platformId, view });
    }

    Router.pushRoute("resources", { platformId, entityId, view });
  }, [platformId, entityId, id]);

  const showError = useCallback((e) => {
    enqueueSnackbar(`${e.message} ${e.error} ${e.details}`, {
      variant: "error",
      persist: false
    });

    console.error(e);
  }, []);

  const onActionHandler = useCallback(action => async () => {
    switch (action.type) {
      case "blondie-flow-trigger":
        await handleBlondieFlowTriggerAction(action, draft, id, entityId);

        break;

      case "google-docs":
        window.gapi.auth2
          .init({
            client_id:
              "543356064989-tu0m528shsc878pjh69ekhqq3ulc7o39.apps.googleusercontent.com"
          })
          .then(
            async auth => {
              let user = await auth.currentUser.get();

              if (!user.isSignedIn()) {
                console.log("Not signed in");

                try {
                  user = await auth.signIn({
                    scope: "https://www.googleapis.com/auth/drive",
                    cookiepolicy: "single_host_origin"
                  });
                } catch (e) {
                  switch (e.error) {
                    case "popup_blocked_by_browser":
                      enqueueSnackbar(
                        "Popup was blocked. Please, enable popups and try again.",
                        {
                          variant: "warning",
                          persist: false,
                          anchorOrigin: {
                            vertical: "top",
                            horizontal: "center"
                          }
                        }
                      );
                      break;
                    default:
                      showError(e);

                      break;
                  }
                }
              }

              async function generateDocument() {
                const authResponse = user.getAuthResponse(true);

                if (!authResponse) {
                  return;
                }

                const { access_token: oauthToken } = authResponse;
                const fields = entity.fields.ordered;

                const mustaches = new Mustaches({
                  token: () => oauthToken
                });

                if (!action.googleDocsSource) return;

                const documentSnackbar = enqueueSnackbar(
                  "Generating document..."
                );

                const source = action.googleDocsSource.id;
                const destination =
                  (action.googleDocsDestination &&
                    action.googleDocsDestination.id) ||
                  null;

                let renderableAttrs = { ...draft };

                await Promise.all(
                  fields.map(async field => {
                    const { type } = field;

                    if (type) {
                      const { autoCalculate } = type;

                      if (autoCalculate) {
                        try {
                          const value = await runCode(autoCalculate, {
                            this: new RecordContext({
                              entityId,
                              record: draft,
                              recordId: id !== "new" ? id : undefined,
                              field,
                              firestore
                            })
                          });

                          if (value) {
                            renderableAttrs[field.id] = value;
                          }
                        } catch (e) {
                          console.error(field.apiName, autoCalculate, e);
                        }
                      }
                    }
                  })
                );

                const attrs = fields.reduce((cum, field) => {
                  cum[field.id] = _.isUndefined(renderableAttrs[field.id])
                    ? ""
                    : renderableAttrs[field.id];
                  cum[field.apiName] = _.isUndefined(renderableAttrs[field.id])
                    ? ""
                    : renderableAttrs[field.id];
                  cum[field.name] = _.isUndefined(renderableAttrs[field.id])
                    ? ""
                    : renderableAttrs[field.id];
                  return cum;
                }, {});

                const name = action.destinationFilenameBuilder
                  ? await runCode(action.destinationFilenameBuilder, {
                    this: new RecordContext({
                      entityId,
                      record: draft,
                      recordId: id !== "new" ? id : undefined,
                      firestore
                    })
                  })
                  : action.name;

                const recordContext = new RecordContext({
                  entityId,
                  record: draft,
                  recordId: id !== "new" ? id : undefined,
                  firestore
                });

                let docId;

                try {
                  docId = await mustaches.interpolate({
                    source,
                    destination,
                    name,
                    data: attrs,
                    resolver: recordContext.get,
                    formatters: {
                      date: value => {
                        if (!value) return "";

                        const date = new Date(
                          value.seconds ? value.seconds * 1000 : value
                        );

                        return dateFns.format(date, "dd.MM.yyyy");
                      },
                      time: value => {
                        if (!value) return "";

                        const date = new Date(
                          value.seconds ? value.seconds * 1000 : value
                        );

                        return dateFns.format(date, "HH:mm");
                      },
                      currency: value => {
                        if (!value) return "";

                        return `${parseFloat(value)
                          .toFixed(2)
                          .replace(/\d(?=(\d{3})+\.)/g, "$& ")}`;
                      }
                    }
                  });
                } catch (e) {
                  console.error(e);

                  closeSnackbar(documentSnackbar);

                  if (e.name && e.name === 'DocumentNotFound') {
                    enqueueSnackbar(
                      "Template was not found in your Google account. Please, try to log in with a different account.",
                      {
                        variant: "warning",
                        persist: false
                      }
                    );

                    user = await auth.signIn({
                      scope: "https://www.googleapis.com/auth/drive",
                      cookiepolicy: "single_host_origin",
                      prompt: "select_account"
                    });

                    return await generateDocument();
                  }

                  enqueueSnackbar("Failed to generate the document. Probably there is something wrong with the document template.", {
                    variant: "error",
                    persist: false
                  });

                  return;
                }

                if (docId) {
                  const popup = window.open(
                    `https://docs.google.com/document/d/${docId}/edit`,
                    "_blank"
                  );

                  try {
                    popup.focus();
                  } catch (e) {
                    closeSnackbar(documentSnackbar);

                    enqueueSnackbar(
                      "Popup window was blocked by the browser. Please, enable popups and try again.",
                      {
                        variant: "warning",
                        persist: false,
                        anchorOrigin: {
                          vertical: "top",
                          horizontal: "center"
                        }
                      }
                    );
                  }
                }

                closeSnackbar(documentSnackbar);
              }

              if (user) {
                await generateDocument();
              }
            }, e => showError(e))
          .catch(e => showError(e));
    }
  });

  return (
    <div className={classes.root}>
      <IndexingSnackbar />
      <GoogleAPIs />

      <Box
        paddingTop={mobile ? 1 : 0}
        paddingLeft={mobile ? 1 : 0}
        paddingRight={mobile ? 1 : 0}
        paddingBottom={1}
        overflow="hidden"
      >
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <BackButton />
          </Grid>
          <Breadcrumbs />
          {!editMode && (
            <>
              {groupedActions &&
                Object.keys(groupedActions)
                  .sort()
                  .map(section => {
                    const actions = _.sortBy(
                      groupedActions[section],
                      ({ name }) => name
                    );

                    if (section === "") {
                      return actions.map(action => {
                        return (
                          <Hidden key={action.id} xsDown>
                            <Grid item>
                              <ActionButton
                                {...{
                                  action,
                                  onActionHandler
                                }}
                              />
                            </Grid>
                          </Hidden>
                        );
                      });
                    } else {
                      return (
                        <Hidden key={section} xsDown>
                          <Grid item>
                            <ActionsSection {...{ section, actions, onActionHandler }} />
                          </Grid>
                        </Hidden>
                      );
                    }
                  })}
              <Grid item>
                <EditButton />
              </Grid>
              <Grid item>
                <CloneButton entityId={entityId} recordId={id} />
              </Grid>
              <Grid item>
                <DeleteButton {...{ onDelete }} />
              </Grid>
            </>
          )}
          {editMode && <EditControls onSave={onSave} />}
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid
          item
          xs={12}
          md={id !== "new" && (hasRelations || hasWidgets) ? 8 : 12}
          lg={id !== "new" && (hasRelations || hasWidgets) ? 8 : 12}
        >
          <RecordFileUploadDropzone recordId={id}>
            <Paper className={classes.paper}>
              <ResourceDetailsTabs />
              <Divider light />
              {["resource", "resourceEdit"].includes(routeName) && (
                <RecordForm {...{ entityId, recordId: id, editMode, onSave }} />
              )}
              {routeName === "resourceFiles" && <ResourceFileList />}
            </Paper>
          </RecordFileUploadDropzone>
          <Box
            paddingBottom={mobile ? 1 : 0}
            paddingLeft={mobile ? 1 : 0}
            paddingRight={mobile ? 1 : 0}
            paddingTop={1}
            overflow="hidden"
          >
            <Slide direction="up" in={editMode}>
              <Grid container spacing={1} justify="flex-end">
                <EditControls onSave={onSave} />
              </Grid>
            </Slide>
          </Box>
        </Grid>
        {id !== "new" && (hasRelations || hasWidgets) && (
          <Grid item xs={12} md={4} lg={4}>
            <RelatedWidgets />
            <RelatedLists />
          </Grid>
        )}
      </Grid>
    </div>
  );
}

export default withStyles(styles)(Details);
