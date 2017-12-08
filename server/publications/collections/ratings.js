import { Meteor } from 'meteor/meteor';
import * as Collections from '/lib/collections';
import { check } from 'meteor/check';

/**
 * Methods
 * @returns {Object} Ratings
 */

Meteor.methods({
  // Save ratings
  saveRatings: (userObject) => {
    check(userObject, Object);
    userObject.userId = Meteor.userId();
    Collections.Ratings.insert(userObject);
    return Collections.Ratings.find({ productId: userObject.productId }).fetch();
  },
  // Fetch ratings
  fetchRatings: (id) => {
    check(id, String);
    return Collections.Ratings.find({ productId: id }).fetch();
  },
  // Fetch orders based on specified condition
  fetchOrders: (productId) => {
    check(productId, String);
    const fetchedResult = Collections.Orders.find({ userId: Meteor.userId() }).fetch();
    return fetchedResult;
  }

});

