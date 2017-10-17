import moment from 'moment';

export const combineCsvs = (csvArray) => {
  return csvArray.reduce((acc, current) => {
    const dateFormatted = current.data.map((value) => {
      value['FIRST APPEARANCE'] = moment(value['FIRST APPEARANCE'], current.dateFormat).format('MM/YYYY');
      if (!value['ALIGN']) {
        value['ALIGN'] = 'Unknown';
      }
      if (!value['YEAR'] && value['Year']) {
        value['YEAR'] = value['Year'];
      }
      return value;
      });
    return acc.concat(dateFormatted);
  }, []);
};

export const extractAlignmentCounts = (data) => {
  return data.reduce((acc, item) => {
    const count = acc.get(item['ALIGN']) || 0;
    acc.set(item['ALIGN'], count + 1);
    return acc;
  }, new Map());
};
