export default fn => (e, ...args) => {
  e.preventDefault();
  e.stopPropagation();

  return fn(e, ...args);
};