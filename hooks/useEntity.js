import useConfiguration from './useConfiguration';

export default function useEntity(id) {
  const configuration = useConfiguration();

  return configuration.entities.data[id];
}
