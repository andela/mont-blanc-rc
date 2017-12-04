import React, { PropTypes } from 'react';

const CancelOrderButton = (props) => {
  const { order } = props;
  if (order.workflow.status !== 'cancelled') {
    return (
      <div className="row cancel-button-row">
        <div className="col-md-12">
          <button className="btn btn-block btn-danger cancel-button">Cancel Order</button>
        </div>
      </div>
    );
  }
};

CancelOrderButton.propTypes = {
  order: PropTypes.object.isRequired
};

export default CancelOrderButton;
