import useConfiguration from './useConfiguration';

export default function useEntityView(id) {
  const configuration = useConfiguration();

  return configuration.views.data[id];
}
