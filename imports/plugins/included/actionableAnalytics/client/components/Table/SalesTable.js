import React from 'react';
import _ from 'lodash';

import { formatPriceString } from '/client/api';


export const SalesTable = (props) => {
  const { fetchedTableData, tableHeadingArray, productSearchTerm } = props;
  const tableHeading = tableHeadingArray.map(item =>
    (<th key={item} >{item}</th>));
  const searchTerm = new RegExp(productSearchTerm.toLowerCase());
  const tablerow = _.map(fetchedTableData, (item, key) => {
    if (key.toLowerCase().match(searchTerm)) {
      return (
        <tr key={key} >
          <td >{key}</td>
          <td >{item.quantitySold}</td>
          <td >{formatPriceString(item.totalSales)}</td>
          <td >{item.firstSale}</td>
          <td >{item.lastSale}</td>
          <td >{item.customerCount}</td>
          <td >{formatPriceString(item.averageSalesPerDay)}</td>
        </tr>
      );
    }
  });
  return (
    <table className="table table-striped table-hover table-responsive table-bordered">
      {
        !_.isEmpty(fetchedTableData)
        &&
        <thead>
          <tr>
            {tableHeading}
          </tr>
        </thead>
      }
      {
        !_.isEmpty(fetchedTableData)
        &&
        <tbody>
          {tablerow}
        </tbody>}
      {
        _.isEmpty(fetchedTableData)
        &&
        <thead>
          <tr>
            <th className="text-center">No Product Sales report</th>
          </tr>
        </thead>
      }
    </table>
  );
};

export default SalesTable;
