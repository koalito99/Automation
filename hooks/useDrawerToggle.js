import { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import actionTypes from "../constants/actionTypes";

function useDrawerToggle() {
  const dispatch = useDispatch();
  const isDrawerVisible = useSelector(state => state.drawer);
  const onDrawerToggle = useCallback(() => {
    dispatch({ type: actionTypes.DRAWER.TOGGLE });
  }, []);

  return [isDrawerVisible, onDrawerToggle];
}

export default useDrawerToggle;
