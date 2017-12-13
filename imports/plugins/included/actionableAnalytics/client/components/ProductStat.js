import React from 'react';
import { registerComponent } from '@reactioncommerce/reaction-components';
import { SimpleChart } from './charts/SimpleChart';
import { SelectOption, DisplayOption } from '../components/selectOption/option';


export const ProductStat = (props) => {
  const {
    salesData, handleChartChange, displayBar, displayPie, handleOptionChange, statValue
  } = props;
  return (
    <div id="tab4" className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-1 tab-pane fade">
      <div className="card container" />
      <div className="row">
        <DisplayOption
          handleOptionChange={handleOptionChange}
          firstValue="quantitySold"
          secondValue="customerCount"
          thirdValue="totalSales"
          fourthValue="averageSalesPerDay"
          firstOption="Quantity Sold"
          secondOption="Customer Count"
          thirdOption="Total Sales"
          fourthOption="Average Sales"
          chartClass="col-md-4 col-md-offset-3"
        />
        <SelectOption
          handleChartChange={handleChartChange}
          firstValue="Bar"
          secondValue="Pie"
          firstOption="Bar chart"
          secondOption="Pie chart"
          chartClass="col-md-4"
        />
      </div>
      <SimpleChart
        fetchedData={salesData}
        statValue={statValue}
      />
    </div>
  );
};
registerComponent('ProductStat', ProductStat);

export default ProductStat;
