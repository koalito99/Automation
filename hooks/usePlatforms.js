import _ from "lodash";
import { useState, useContext, useEffect } from "react";
import { ReduxFirestoreContext } from "react-redux-firebase";
import useAuth from "./useAuth";

function usePlatforms() {
  const [platforms, setPlatforms] = useState();
  const auth = useAuth();
  const firestore = useContext(ReduxFirestoreContext);

  useEffect(() => {
    const fn = async () => {
      const [ownerPlatforms, memberPlatforms] = await Promise.all([
        firestore
          .collection("platforms")
          .where("owner", "==", auth.uid)
          .get(),
        firestore
          .collection("platforms")
          .where("members", "array-contains", firestore.collection("users").doc(auth.uid))
          .get()
      ]);

      const docs = _([...ownerPlatforms.docs, ...memberPlatforms.docs])
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .sortBy(doc => _.lowerCase(doc.title))
        .value();

      setPlatforms(docs);
    };

    fn();
  }, [auth]);

  return platforms;
}

export default usePlatforms;
