
import React from 'react';
import { registerComponent } from '@reactioncommerce/reaction-components';
import { formatPriceString } from '/client/api';
import { Box } from '../components/box/Box';


export const RetailDashBoard = (props) => {
  const { OrdersData } = props;
  const {
    totalSales,
    salesPerDay,
    ordersCancelled,
    ordersPlaced,
    totalItemsPurchased,
  } = OrdersData;
  return (
    <div
      id="tab1"
      className="col-sm-12 col-md-12 col-lg-10 col-lg-offset-2 tabBox tab-pane fade in active"
    >
      {/* Revenue board */}
      <Box
        boxTitle="REVENUE"
        boxValue={formatPriceString(totalSales)}
      />
      {/* Avaerage sales board */}
      <Box
        boxTitle="AVERAGE SALES PER DAY"
        boxValue={formatPriceString(salesPerDay)}
      />
      {/* cancelled order box */}
      <Box
        boxTitle="CANCELLED ORDERS COUNT"
        boxValue={ordersCancelled}
      />
      {/* gross profit box */}
      <Box
        boxTitle="GROSS PROFIT"
        boxValue="$200,000"
      />
      {/* placed orders board */}
      <Box
        boxTitle="PLACED ORDERS COUNT"
        boxValue={ordersPlaced}
      />
      {/* purchased item board */}
      <Box
        boxTitle="PURCHASED ITEM COUNT"
        boxValue={totalItemsPurchased}
      />
    </div>
  );
};
registerComponent('RetailDashBoard', RetailDashBoard);
export default RetailDashBoard;
