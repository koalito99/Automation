import { useEffect, useState } from 'react';
import useFirestore from './useFirestore';
import useAuth from './useAuth';

export default function useViews(entityId) {
  const [userViews, setUserViews] = useState([]);
  const [globalViews, setGlobalViews] = useState([]);
  const firestore = useFirestore();
  const auth = useAuth();

  const buildViewProcessor = fn => ({ docs }) =>
    fn(
      docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }))
    );

  useEffect(() => {
    return firestore
      .collection("views")
      .where("type", "==", "table")
      .where("state", "==", "active")
      .where("uid", "==", auth.uid)
      .where("entity", "==", firestore.collection("entities").doc(entityId))
      .orderBy("name", "asc")
      .onSnapshot(buildViewProcessor(setUserViews));
  }, [entityId]);

  useEffect(() => {
    return firestore
      .collection("views")
      .where("state", "==", "active")
      .where("uid", "==", null)
      .where("entity", "==", firestore.collection("entities").doc(entityId))
      .orderBy("name", "asc")
      .onSnapshot(buildViewProcessor(setGlobalViews));
  }, [entityId]);

  return [...userViews, ...globalViews];
}
