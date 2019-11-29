import { Router } from '../routes';

export default async function goToPreviousRecord({ path, firestore, platformId, view }) {
  const ids = path.split('~');
  const doc = await firestore.collection("records").doc(_.last(ids)).get();
  const data = { ...doc.data(), id: doc.id };
  ids.pop();
  const newPath = ids.length ? ids.join('~') : null;

  return Router.pushRoute("resource", { platformId, id: data.id, entityId: data.entity.id, view, path: newPath });
}
