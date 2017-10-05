import moment from 'moment';

export const combineCsvs = (csvArray) => {
  return csvArray.reduce((acc, current) => {
    const dateFormatted = current.data.map((value) => {
      value['FIRST APPEARANCE'] = moment(value['FIRST APPEARANCE'], current.dateFormat).format('MM/YYYY');
      return value;
      });
    return acc.concat(dateFormatted);
  }, []);
};
