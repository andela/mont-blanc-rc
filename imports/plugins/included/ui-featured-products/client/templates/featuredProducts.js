import { Components } from '@reactioncommerce/reaction-components';
import { Template } from 'meteor/templating';
import { Reaction } from '/client/api';
import { Meteor } from 'meteor/meteor';

Template.featuredProducts.helpers({
  component() {
    return Components.FeaturedProducts;
  }
});
