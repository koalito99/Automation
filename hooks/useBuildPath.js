import useRouteParams from './useRouteParams';

export default function useBuildPath() {
  let { path, id } = useRouteParams();

  let pathParts = [];
  if (path) {
    pathParts = path.split('~');
  }

  pathParts.push(id);

  return pathParts.join('~');
}
