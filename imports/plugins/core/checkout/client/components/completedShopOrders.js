import React from 'react';
import PropTypes from 'prop-types';
import { registerComponent } from '@reactioncommerce/reaction-components';
import CompletedOrderItem from './completedOrderItem';

/**
 * @summary Displays the order breakdown for each Shop
 * @param {Object} props - React PropTypes
 * @property {String} shopName - The name of the shop
 * @property {Array} items - an array of individual items for this shop
 * @property {Function} handleDisplayMedia - A function for displaying product images
 * @property {boolean} isProfilePage - Checks if current page is profile page
 * @return {Node} React node containing the break down of the order by Shop
 */
const CompletedShopOrders = ({
  shopName, items, handleDisplayMedia, shippingMethod, isProfilePage
}) => {
  const shippingName = isProfilePage ? (
    <span>
      <strong>
        {shippingMethod.label}
      </strong>{shippingMethod.deliveryDate &&
        <span>
          - estimated delivery {shippingMethod.deliveryDate}
        </span>}
    </span>
  ) : `${shippingMethod.carrier} - ${shippingMethod.label}`;
  const determineType = (types) => {
    let checker = false;
    // let nextchecker = false;
    types.map((type) => {
      if (type.productType === 'nonDigital') {
        checker = true;
        return checker;
      }
    });
    return checker;
  };

  const determineNextType = (types) => {
    let nextchecker = false;
    types.map((type) => {
      if (type.productType === 'digital') {
        nextchecker = true;
        return nextchecker;
      }
    });
    return nextchecker;
  };
  return (
    <div>
      {determineType(items) ?
        <div className="order-details-shop-breakdown">
          {/* This is the left side / main content */}
          <div className="order-details-info-box">
            <div className="store-detail-box">
              <span className="order-details-store-title">{shopName} Non-Digital Items</span>
              <span className="order-details-shipping-name">{shippingName}</span>
            </div>
          </div>
          <div className="order-details-info-box-topless">
            {items.map((item) => {
              if (item.productType === 'nonDigital') {
                return (<CompletedOrderItem
                  item={item}
                  key={item._id}
                  handleDisplayMedia={handleDisplayMedia}
                />);
              }
            })}
          </div>

          {/* This is the left side / main content */}
        </div> : ''}

      {determineNextType(items) ? <div className="order-details-shop-breakdown">
        {/* This is the left side / main content */}
        <div className="order-details-info-box">
          <div className="store-detail-box">
            <span className="order-details-store-title">{shopName} Digital items</span>
            <span className="order-details-shipping-name">Download Link</span>
          </div>
        </div>
        <div className="order-details-info-box-topless">
          {items.map((item) => {
            if (item.productType === 'digital') {
              return (<CompletedOrderItem
                item={item}
                key={item._id}
                handleDisplayMedia={handleDisplayMedia}
              />);
            }
          })}
        </div>

        {/* This is the left side / main content */}
      </div> : ''}
    </div>


  );
};

CompletedShopOrders.propTypes = {
  handleDisplayMedia: PropTypes.func,
  isProfilePage: PropTypes.bool,
  items: PropTypes.array,
  order: PropTypes.object,
  shippingMethod: PropTypes.object,
  shopName: PropTypes.string
};

registerComponent('CompletedShopOrders', CompletedShopOrders);

export default CompletedShopOrders;
