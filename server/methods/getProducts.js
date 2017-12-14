import { Meteor } from 'meteor/meteor';
import * as Collections from '/lib/collections';

Meteor.methods({

  getProductInventoryData: (objectValue) => {
    check(objectValue, Object);
    check(objectValue.searchTerm, String);
    return Collections.Products.find({
      $and: [{
        type: 'variant',
        title: {
          $regex: objectValue.searchTerm,
          $options: 'i'
        }
      }]
    }).fetch();
  }
});
