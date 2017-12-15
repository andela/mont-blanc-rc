import React, { PropTypes } from 'react';

const CancelOrderButton = (props) => {

  const { order } = props;
  return (
    <div>
      {order.workflow.status !== 'cancelled' ?
        (<div className="row cancel-button-row">
          <div className="col-md-12">
            <button onClick={props.onCancelOrderClick} className="btn btn-block btn-danger cancel-button">Cancel Order</button>
          </div>
        </div>) :
        ' '
      }
    </div>
  );
};

CancelOrderButton.propTypes = {
  order: PropTypes.object.isRequired,
  onCancelOrderClick: PropTypes.func.isRequired
};

export default CancelOrderButton;
