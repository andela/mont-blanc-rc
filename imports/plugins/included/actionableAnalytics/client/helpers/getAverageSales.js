import { getDateDifference } from '../helpers/getDateDifference';

export const getAverageSales = (totalSales, fromDate, toDate) => {
  const difference = getDateDifference(fromDate, toDate);
  const salesPerDay = difference === 0 ? totalSales : totalSales / difference;
  return salesPerDay;
};

export default getAverageSales;
