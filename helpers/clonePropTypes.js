function clonePropTypes(source, propTypes) {
  const allPropTypes = (source.Naked || source).propTypes || {};
  return (propTypes || Object.keys(allPropTypes)).reduce((cum, key) => {
    cum[key] = allPropTypes[key];
    return cum;
  }, {});
}

export default clonePropTypes;
