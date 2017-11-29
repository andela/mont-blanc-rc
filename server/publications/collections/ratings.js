import { Meteor } from "meteor/meteor";
import * as Collections from "/lib/collections";
import { check } from "meteor/check";

/**
 * Methods
 * @returns {Object} Ratings
 */

Meteor.methods({
  saveRatings: function (userObject) {
    check(userObject, Object);
    userObject.userId = Meteor.userId();
    Collections.Ratings.insert(userObject);
    return Collections.Ratings.find({ productId: userObject.productId }).fetch();
  },
  fetchRatings: function (id) {
    check(id, String);
    return Collections.Ratings.find({ productId: id }).fetch();
  },
  fetchOrders: function (productId) {
    check(productId, String);
    const fetchedResult = Collections.Orders.find({ userId: Meteor.userId() }).fetch();
    return fetchedResult;
  }
});

