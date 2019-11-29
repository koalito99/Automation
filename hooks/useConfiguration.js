import { useContext } from "react";
import ConfigurationContext from "contexts/configuration";

function useConfiguration() {
  return useContext(ConfigurationContext);
}

export default useConfiguration;
