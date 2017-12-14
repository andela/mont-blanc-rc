import { Meteor } from 'meteor/meteor';
import * as Collections from '/lib/collections';

Meteor.methods({

  getOrders: (objectValue) => {
    check(objectValue, Object);
    check(objectValue.toDate, Number);
    check(objectValue.fromDate, Number);
    return Collections.Orders.find({
      createdAt: {
        $gte: new Date(objectValue.fromDate),
        $lte: new Date(objectValue.toDate),
      }
    }).fetch();
  }
});
