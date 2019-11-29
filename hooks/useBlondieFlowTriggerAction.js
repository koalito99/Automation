import axios from 'axios';
import { useSnackbar } from 'notistack';
import { RecordContext, runCode } from 'blondie-platform-common';
import useFirestore from './useFirestore';

export default function useBlondieFlowTriggerAction() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const firestore = useFirestore();

  return async (action, record, recordId, entityId) => {
    const flowSnackbar = enqueueSnackbar("Starting process...");

    const [
      flowId,
      flowApiKey,
      entityType,
      calculatedEntityId,
      eventName,
      payload
    ] = await Promise.all(
      [
        "flowId",
        "flowApiKey",
        "entityType",
        "entityId",
        "eventName",
        "payload"
      ].map(async field => {
        try {
          return await runCode(action[field], {
            this: new RecordContext({
              entityId,
              record: record,
              recordId: recordId !== "new" ? recordId : undefined,
              field,
              firestore
            })
          });
        } catch (e) {
          console.error(field, action[field], e);
        }
      })
    );

    await axios({
      url: "https://flow.blondieapps.com/webhooks/events/",
      method: "POST",
      headers: { Authorization: `Bearer ${flowApiKey}` },
      data: {
        wait: true,
        flowId,
        entityType,
        entityId: calculatedEntityId,
        eventName,
        payload
      }
    });

    closeSnackbar(flowSnackbar);

    enqueueSnackbar(
      "Process has started. Please, give it a minute or two to complete."
    );
  }
}
