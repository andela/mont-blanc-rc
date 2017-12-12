import React from 'react';
import { registerComponent } from '@reactioncommerce/reaction-components';
import { SimpleChart } from './charts/saleschart';
import { Chart } from './charts/customerCount';
import { SelectOption, DisplayOption } from '../components/selectOption/option';


export const ProductStat = (props) => {
  const {
    salesData, handleChartChange, displayBar, displayPie, handleOptionChange, customerDisplayBar, customerDisplayPie
  } = props;
  return (
    <div id="tab4" className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 tab-pane fade">
      <div className="card container" />
      <div className="col-md-4 col-md-offset-2">
        <DisplayOption
          handleOptionChange={handleOptionChange}
          firstValue="sales"
          secondValue="customer"
          firstOption="Product sales"
          secondOption="Customer count"
          chartClass="col-md-6 col-md-offset-1"
        />
        <SelectOption
          handleChartChange={handleChartChange}
          firstValue="Bar"
          secondValue="Pie"
          firstOption="Bar chart"
          secondOption="Pie chart"
          chartClass="col-md-6 col-md-offset-1"
        />
      </div>
      <SimpleChart
        displayBar={displayBar}
        displayPie={displayPie}
        fetchedData={salesData}
      />
      <Chart
        customerDisplayBar={customerDisplayBar}
        customerDisplayPie={customerDisplayPie}
        fetchedData={salesData}
      />
    </div>
  );
};
registerComponent('TopSalesReport', ProductStat);

export default ProductStat;
