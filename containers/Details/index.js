import { compose, withHandlers, branch, renderNothing, withState, lifecycle } from "recompose";
import { connect } from "react-redux";
import Mustaches from "blondie-inc-google-docs-mustaches";
import * as dateFns from "date-fns";

import { Router } from "../../routes";

import withEntity from "helpers/withEntity";
import withDraft from "helpers/withDraft";
import withRouterParams from "helpers/withRouterParams";
import withRouter from "helpers/withRouter";
import withIndexing from "helpers/withIndexing";
import { runCode, RecordContext } from "blondie-platform-common";
import Details from "components/MasterDetailsView/Details";
import connectEntityItem from "connectors/entityItem";
import { withSnackbar } from "notistack";

import { STATE_TYPES } from "blondie-platform-common";
import { withFirestore } from "react-redux-firebase";
import Record from '../../helpers/Record';
import withConfiguration from '../../helpers/withConfiguration';

// const mapStateToProps = state => ({
//   auth: state.firebase.auth
// });

export default compose(
  withState("token", "setToken"),
  withFirestore,
  // withConfiguration,
  // withRouter,
  // withRouterParams("platformId", "entityId", "id", "view"),
  // withEntity,
  withIndexing,
  // withSnackbar,
  // connectEntityItem,
  // withDraft(props => {
  //   const {
  //     firestore,
  //     entity: {
  //       fields: {
  //         filtered: { form: fields }
  //       }
  //     }
  //   } = props;

  //   const initialProps = fields.reduce((cum, field) => {
  //     if (props[field.id]) {
  //       if (!!field.relation) {
  //         cum[field.id] = props[field.id];
  //       }
  //     }
  //     return cum;
  //   }, {});

  //   return initialProps;
  // }),
  // branch(({ draft }) => !draft, renderNothing),
  // connect(mapStateToProps),
  withHandlers({
    // onCancel: ({ platformId, entityId, id, view, onCancel }) => () => {
    //   if (onCancel) {
    //     onCancel();
    //   } else {
    //     Router.pushRoute("resource", { platformId, entityId, id, view });
    //   }
    // }
  }),
  withHandlers({
    // onSave: ({
    //   firestore,
    //   id,
    //   platformId,
    //   entityId,
    //   draft,
    //   setErrors,
    //   onCancel,
    //   setIndexing,
    //   auth,
    //   quick,
    //   view,
    //   configuration
    // }) => async e => {
    //   e.preventDefault();

    //   const attrs = { ...draft };
    //   if (id !== "new") {
    //     attrs.id = id;
    //   }

    //   const record = new Record(firestore, configuration, entityId, attrs, auth);
    //   await record.save();

    //   if (record.errors.length) {
    //     setErrors(record.errors);

    //     return;
    //   }

    //   setIndexing(true);

    //   if (quick) {
    //     onCancel();
    //   } else {
    //     Router.pushRoute("resource", {
    //       platformId,
    //       entityId,
    //       id: record.attrs.id,
    //       view
    //     });
    //   }

    //   setTimeout(() => setIndexing(false), 5000);
    // },
    // onDelete: ({ firestore, platformId, entityId, id, setIndexing }) => () => {
    //   firestore.update(`records/${id}`, { state: STATE_TYPES.DELETED });
    //   setIndexing(true);
    //   Router.pushRoute("resources", { platformId, entityId });
    // }
  }),
  withHandlers({
    // onActionHandler: ({
    //   id,
    //   entityId,
    //   firestore,
    //   draft,
    //   token,
    //   enqueueSnackbar,
    //   closeSnackbar,
    //   ...props
    // }) => action => async () => {
    //   window.gapi.auth2
    //     .init({
    //       client_id: "543356064989-tu0m528shsc878pjh69ekhqq3ulc7o39.apps.googleusercontent.com"
    //     })
    //     .then(
    //       async auth => {
    //         let user = await auth.currentUser.get();

    //         if (!user.isSignedIn()) {
    //           console.log("Not signed in");

    //           try {
    //             user = await auth.signIn({
    //               scope: "https://www.googleapis.com/auth/drive",
    //               cookiepolicy: "single_host_origin"
    //             });
    //           } catch (e) {
    //             switch (e.error) {
    //               case "popup_blocked_by_browser":
    //                 enqueueSnackbar("Popup was blocked. Please, enable popups and try again.", {
    //                   variant: "warning",
    //                   persist: false,
    //                   anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "center"
    //                   }
    //                 });
    //                 break;
    //               default:
    //                 enqueueSnackbar(e.error, { variant: "error", persist: false });
    //                 console.error(e);
    //                 break;
    //             }
    //           }
    //         }

    //         async function generateDocument() {
    //           const { access_token: oauthToken } = user.getAuthResponse(true);

    //           const {
    //             entity: {
    //               fields: { ordered: fields }
    //             }
    //           } = props;

    //           const mustaches = new Mustaches({
    //             token: () => oauthToken
    //           });

    //           if (!action.googleDocsSource) return;

    //           const documentSnackbar = enqueueSnackbar("Generating document...");

    //           const source = action.googleDocsSource.id;
    //           const destination =
    //             (action.googleDocsDestination && action.googleDocsDestination.id) || null;

    //           let renderableAttrs = { ...draft };

    //           await Promise.all(
    //             fields.map(async field => {
    //               const { type } = field;

    //               if (type) {
    //                 const { autoCalculate } = type;

    //                 if (autoCalculate) {
    //                   try {
    //                     const value = await runCode(autoCalculate, {
    //                       this: new RecordContext({
    //                         entityId,
    //                         record: draft,
    //                         recordId: id !== "new" ? id : undefined,
    //                         firestore
    //                       })
    //                     });

    //                     if (value) {
    //                       renderableAttrs[field.id] = value;
    //                     }
    //                   } catch (e) {
    //                     console.error(field.apiName, autoCalculate, e);
    //                   }
    //                 }
    //               }
    //             })
    //           );

    //           const attrs = fields.reduce((cum, field) => {
    //             cum[field.id] = _.isUndefined(renderableAttrs[field.id])
    //               ? ""
    //               : renderableAttrs[field.id];
    //             cum[field.apiName] = _.isUndefined(renderableAttrs[field.id])
    //               ? ""
    //               : renderableAttrs[field.id];
    //             cum[field.name] = _.isUndefined(renderableAttrs[field.id])
    //               ? ""
    //               : renderableAttrs[field.id];
    //             return cum;
    //           }, {});

    //           const name = action.destinationFilenameBuilder
    //             ? await runCode(action.destinationFilenameBuilder, {
    //                 this: new RecordContext({
    //                   entityId,
    //                   record: draft,
    //                   recordId: id !== "new" ? id : undefined,
    //                   firestore
    //                 })
    //               })
    //             : action.name;

    //           let id;

    //           try {
    //             id = await mustaches.interpolate({
    //               source,
    //               destination,
    //               name,
    //               data: attrs,
    //               formatters: {
    //                 date: value => {
    //                   if (!value) return "";

    //                   const date = new Date(value.seconds ? value.seconds * 1000 : value);

    //                   return dateFns.format(date, "dd.MM.yyyy");
    //                 },
    //                 time: value => {
    //                   if (!value) return "";

    //                   const date = new Date(value.seconds ? value.seconds * 1000 : value);

    //                   return dateFns.format(date, "HH:mm");
    //                 },
    //                 currency: value => {
    //                   if (!value) return "";

    //                   return `${parseFloat(value)
    //                     .toFixed(2)
    //                     .replace(/\d(?=(\d{3})+\.)/g, "$& ")}`;
    //                 }
    //               }
    //             });
    //           } catch (e) {
    //             console.error(e);

    //             closeSnackbar(documentSnackbar);

    //             enqueueSnackbar("Failed to generate the document", {
    //               variant: "error",
    //               persist: false
    //             });
    //           }

    //           if (id) {
    //             const popup = window.open(
    //               `https://docs.google.com/document/d/${id}/edit`,
    //               "_blank"
    //             );

    //             try {
    //               popup.focus();
    //             } catch (e) {
    //               closeSnackbar(documentSnackbar);

    //               enqueueSnackbar(
    //                 "Popup window was blocked by the browser. Please, enable popups and try again.",
    //                 {
    //                   variant: "warning",
    //                   persist: false,
    //                   anchorOrigin: {
    //                     vertical: "top",
    //                     horizontal: "center"
    //                   }
    //                 }
    //               );
    //             }
    //           } else {
    //             closeSnackbar(documentSnackbar);

    //             enqueueSnackbar(
    //               "Template was not found in your Google account. Please, try to log in with a different account.",
    //               {
    //                 variant: "warning",
    //                 persist: false
    //               }
    //             );

    //             user = await auth.signIn({
    //               scope: "https://www.googleapis.com/auth/drive",
    //               cookiepolicy: "single_host_origin",
    //               prompt: "select_account"
    //             });

    //             await generateDocument();
    //           }

    //           closeSnackbar(documentSnackbar);
    //         }

    //         if (user) {
    //           await generateDocument();
    //         }
    //       },
    //       e => enqueueSnackbar(e.message, { variant: "error", persist: false })
    //     );
    // }
  })
)(Details);
