import { ReactReduxFirebaseContext } from "react-redux-firebase";
import { useCallback, useContext } from "react";

function useSignOut() {
  const firebase = useContext(ReactReduxFirebaseContext);
  return useCallback(() => firebase.auth().signOut());
}

export default useSignOut;
