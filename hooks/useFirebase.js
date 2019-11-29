import { useContext } from 'react';
import { ReactReduxFirebaseContext } from 'react-redux-firebase';

function useFirebase() {
  return useContext(ReactReduxFirebaseContext);
}

export default useFirebase;