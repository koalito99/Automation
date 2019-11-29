import { Router } from '../routes';

export default async function goToBreadcrumbPart({ path, platformId, entityId, recordId, view }) {
  const ids = path.split('~');
  const index = ids.indexOf(recordId);
  const newPathParts = ids.slice(0, index);
  const params = {
    platformId,
    id: recordId,
    entityId,
    view,
  };

  if (newPathParts.length) {
    params.path = newPathParts.join('~');
  }

  return Router.pushRoute("resource", params);
}
