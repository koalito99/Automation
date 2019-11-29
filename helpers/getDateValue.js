const getDateValue = (date) => {
  switch (true) {
    case date && date.toDate:
      return date.toDate();

    case date instanceof Date:
      return date;

    default:
      return null;
  }
};

export default getDateValue;
