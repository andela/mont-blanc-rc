import React from 'react';
import PropTypes from 'prop-types';
import {
  Components
} from '@reactioncommerce/reaction-components';
import {
  Meteor
} from 'meteor/meteor';
import CompletedShopOrders from './completedShopOrders';
import CompletedOrderPaymentMethod from './completedOrderPaymentMethods';
import CompletedOrderSummary from './completedOrderSummary';
import AddEmail from './addEmail';
import CancelOrderButton from './cancelOrderButton';

/**
 * @summary Displays a summary/information about the order the user has just completed
 * @param {Object} props - React PropTypes
 * @property {Object} order - An object representing the order
 * @property {String} orderID - the unique identifier of the order
 * @property {Array} shops - An Array contains information broken down by shop
 * @property {Object} orderSummary - An object containing the items making up the order summary
 * @property {Array} paymentMethod - An array of paymentMethod objects
 * @property {Function} handleDisplayMedia - A function for displaying the product image
 * @property {Booleam} isProfilePage - A boolean value that checks if current page is user profile page
 * @return {Node} React node containing the top-level component for displaying the completed order/receipt page
 */
class CompletedOrder extends React.Component {
  /**
   * Creates an instance of CompletedOrder.
   * @param {any} props
   * @memberof CompletedOrder
   */
  constructor(props) {
    super(props);
    this.state = {
      order: props.order,
      orderId: props.orderId,
      shops: props.shops,
      orderSummary: props.orderSummary,
      paymentMethods: props.paymentMethods,
      handleDisplayMedia: props.handleDisplayMedia,
      isProfilePage: props.isProfilePage,
      isCancelled: false
    };
    this.onCancelOrderClick = this.onCancelOrderClick.bind(this);
  }

  /**
   *
   * @returns {*} render
   * @param {any} event
   * @memberof CancelOrderButton
   */
  onCancelOrderClick(event) {
    event.preventDefault();
    const { order } = this.props;
    Alerts.alert({
      title: 'Cancel Order',
      type: 'question',
      text: 'Are you sure you want to cancel this order?',
      showCancelButton: true,
    }, () => {
      const { email } = order;
      const amount = order.billing[0].invoice.total;
      const transaction = {
        amount: Number(amount),
        to: email,
        date: new Date(),
        transactionType: 'Credit'
      };

      Meteor.call('orders/cancelOrder', order, true);

      Meteor.call(
        'wallet/transaction',
        Meteor.userId(),
        transaction,
        (err, res) => {
          if (res === 2) {
            Alerts.toast(`No user with email ${email}`, 'error');
          } else if (res === 1) {
            Alerts.toast('Order successfully cancelled', 'success');
            this.setState({
              isCancelled: true
            });
          } else {
            Alerts.toast('An error occured, please try again', 'error');
          }
        }
      );
    });
  }

  /**
   *
   *
   * @returns {Object} render object
   * @memberof CompletedOrder
   */
  render() {
    if (!this.state.order) {
      return (
        <Components.NotFound
          i18nKeyTitle="order.notFound"
          icon="fa fa-barcode"
          title="Order Not Found"
        />
      );
    }

    let headerText;

    if (this.state.isProfilePage) {
      headerText = (
        <p className="order-id">
          <strong>Order ID</strong>
          {this.state.orderId}
        </p>
      );
    } else {
      headerText = (
        <div className="order-details-header" > { /* This is the left side / main content */}
          <h3 >
            <Components.Translation
              defaultValue="Thank You"
              i18nKey="cartCompleted.thankYou"
            />
          </h3>
          <p>
            <strong>Order ID </strong>
            {this.state.orderId}
          </p> { /* show a different message depending on whether we have an email or not */}
          <AddEmail
            order={this.state.order}
            orderEmail={this.state.order.email}
          /> { /* This is the left side / main content */}
          {this.state.isCancelled ? (<p className="completed-cancel">Your order has been cancelled</p>) : ' '}
        </div>
      );
    }

    return (
      <div className="container order-completed" >
        {headerText}
        <div className="order-details-main" >
          <div className="order-details-content-title" >
            <p>
              <Components.Translation
                defaultValue="Your Items"
                i18nKey="cartCompleted.yourItems"
              />

            </p >
          </div> {
            this.state.shops.map((shop) => {
              const shopKey = Object.keys(shop);
              return (
                <CompletedShopOrders
                  shopName={
                    shop[shopKey].name
                  }
                  items={
                    shop[shopKey].items
                  }
                  key={
                    shopKey
                  }
                  shippingMethod={
                    shop[shopKey].shippingMethod
                  }
                  handleDisplayMedia={
                    this.state.handleDisplayMedia
                  }
                  isProfilePage={
                    this.state.isProfilePage
                  }
                />
              );
            })
          }
        </div>
        <div className="order-details-side" >
          { /* This is the right side / side content */}
          <div className="shipping-payment-details" >
            <div className="shipping-info" >
              <div className="order-details-content-title" >
                <p>
                  <Components.Translation
                    defaultValue="Shipping Address"
                    i18nKey="cartCompleted.shippingAddress"
                  />
                </p>
              </div>
              {this.state.orderSummary.shipping.map((shipment) => {
                if (shipment.address.fullName || shipment.address.address1) {
                  return (
                    <div
                      className="order-details-info-box"
                      key={shipment._id}
                    >
                      <div
                        className="order-details-info-box-content"
                      >
                        <p>
                          {shipment.address.fullName}
                          <br />
                          {shipment.address.address1}
                          <br />
                          {shipment.address.city},
                          {shipment.address.region}
                          {shipment.address.postal}
                          {shipment.address.country}
                        </p>
                      </div>
                    </div>);
                }
              })
              }
            </div>

            <div className="payment-info" >
              <div className="order-details-content-title" >
                <p>
                  <Components.Translation
                    defaultValue="Payment Method"
                    i18nKey="cartCompleted.paymentMethod"
                  />
                </p >
              </div>
              {
                this.state.paymentMethods.map(paymentMethod => (
                  <CompletedOrderPaymentMethod
                    key={paymentMethod.key}
                    paymentMethod={paymentMethod}
                  />))
              }
            </div>
          </div>
          <CompletedOrderSummary
            shops={
              this.state.shops
            }
            orderSummary={
              this.state.orderSummary
            }
            isProfilePage={
              this.state.isProfilePage
            }
          />
          {
            this.state.isCancelled ?
              ' ' :
              (<CancelOrderButton isCancelled={this.state.isCancelled} onCancelOrderClick={this.onCancelOrderClick} order={this.state.order} />)
          }


          { /* This is the right side / side content */}
        </div>
      </div>
    );
  }
}

CompletedOrder.propTypes = {
  handleDisplayMedia: PropTypes.func.isRequired,
  isProfilePage: PropTypes.bool.isRequired,
  order: PropTypes.object.isRequired,
  orderId: PropTypes.string.isRequired,
  orderSummary: PropTypes.object.isRequired,
  paymentMethods: PropTypes.array.isRequired,
  shops: PropTypes.array.isRequired
};

export default CompletedOrder;
