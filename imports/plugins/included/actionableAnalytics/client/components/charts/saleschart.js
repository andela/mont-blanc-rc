import React from 'react';
import _ from 'lodash';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Pie, PieChart } from 'recharts';

export const SimpleChart = (props) => {
  // const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  const { fetchedData, displayBar, displayPie } = props;
  const mappedData = [];
  const salesPieData = [];
  _.map(fetchedData, (items, key) =>
    salesPieData.push({
      name: key,
      value: items.quantitySold,
    }));
  _.map(fetchedData, (items, key) =>
    mappedData.push({
      name: key,
      quantitySold: items.quantitySold,
      value: items.customerCount
    }));
  return (
    <div className="row container">
      <div className="col-md-4 col-md-offset-3" style={{ display: displayBar }} id="Bar">
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
          <Bar dataKey="quantitySold" fill="#8884d8" />
        </BarChart>
        <h5>Customer count for each product</h5>
      </div>
      <div id="Pie" style={{ display: displayPie }} className="col-md-4 col-md-offset-3">
        <PieChart width={800} height={400}>
          <Pie isAnimationActive={false} data={salesPieData} cx={200} cy={200} outerRadius={80} fill="#8884d8" label />
          <Pie data={salesPieData} cx={500} cy={200} innerRadius={40} outerRadius={80} fill="#82ca9d" />
          <Tooltip />
        </PieChart>
        <h5>Customer count for each product</h5>
      </div>
    </div>
  );
};
export default SimpleChart;
