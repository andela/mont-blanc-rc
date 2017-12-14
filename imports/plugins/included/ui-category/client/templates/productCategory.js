import { Components } from '@reactioncommerce/reaction-components';
import { Template } from 'meteor/templating';
import { Reaction } from '/client/api';

Template.productCategory.events({
  'click button': function (event) {
    event.preventDefault();
    localStorage.setItem('category', event.target.value);
    Reaction.Router.go('category');
  },
});
