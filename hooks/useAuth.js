import { useSelector } from "react-redux";

function useAuth() {
  return useSelector(state => state.firebase.auth);
}

export default useAuth;
