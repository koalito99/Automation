export default function countNonBlank(obj, keys) {
  return keys.reduce((count, key) => {
    if (_.has(obj, key) && !!obj[key]) {
      count++;
    }
    return count;
  }, 0);
}
