import { Components } from '@reactioncommerce/reaction-components';
import { Template } from 'meteor/templating';
import { Reaction } from '/client/api';
import { Meteor } from 'meteor/meteor';

Template.category.helpers({
  component() {
    return Components.ProductCategory;
  }
});
