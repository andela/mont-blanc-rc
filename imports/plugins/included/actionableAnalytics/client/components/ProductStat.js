import React from 'react';
import { registerComponent } from '@reactioncommerce/reaction-components';


export const ProductStat = props => (
  <div id="tab4" className="col-sm-10 tabBox tab-pane fade">
    <div className="card container" />

    {/** ************ for chart ******** */}
  </div>
);
registerComponent('TopSalesReport', ProductStat);

export default ProductStat;
