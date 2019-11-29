export default (popupState) => (fn) => (e) => {
  e.preventDefault();
  e.stopPropagation();
  popupState.close();
  return fn(e);
};