import { useContext } from 'react';
import { ReduxFirestoreContext } from 'react-redux-firebase';

function useFirestore() {
  return useContext(ReduxFirestoreContext);
}

export default useFirestore;