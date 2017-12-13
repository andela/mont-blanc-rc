import React from 'react';
import _ from 'lodash';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

export const SimpleChart = (props) => {
  const { fetchedData, statValue } = props;
  const mappedData = [];
  const pieData = [];
  _.map(fetchedData, (items, key) =>
    mappedData.push({
      name: key,
      quantitySold: items.quantitySold,
      customerCount: items.customerCount,
      totalSales: items.totalSales,
      averageSalesPerDay: items.averageSalesPerDay
    }));
  _.map(fetchedData, (items, key) =>
    pieData.push({
      name: key,
      value: items.averageSalesPerDay
    }));
  return (
    <div className="row container">
      <div className="col-md-4 col-md-offset-3" id="Bar">
        <BarChart
          width={600}
          height={300}
          data={mappedData}
          margin={{
            top: 5, right: 30, left: 20, bottom: 5
          }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          {statValue === 'quantitySold' && <Bar dataKey="quantitySold" fill="#8884d8" />}
          {statValue === 'customerCount' && <Bar dataKey="customerCount" fill="#82ca9d" />}
          {statValue === 'totalSales' && <Bar dataKey="totalSales" fill="#01c8ff" />}
          {statValue === 'averageSalesPerDay' && <Bar dataKey="averageSalesPerDay" fill="#ff01fa" />}
        </BarChart>
        <h5>Customer count for each product</h5>
      </div>
    </div>
  );
};
export default SimpleChart;
