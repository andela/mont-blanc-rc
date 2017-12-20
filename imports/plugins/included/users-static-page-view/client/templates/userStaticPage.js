import { Reaction } from '/client/api';
import { Template } from 'meteor/templating';
import { $ } from 'meteor/jquery';
import { Meteor } from 'meteor/meteor';
import { StaticPage } from '/lib/collections';

Template.moreStaticPages.onCreated(function () {
  this.autorun(() => {
    this.subscribe('StaticPage');
  });
});

Template.moreStaticPages.helpers({
  userStaticPage() {
    const instance = Template.instance();
    if (instance.subscriptionsReady()) {
      return StaticPage.find({
        shopId: Reaction.getShopId()
      });
    }
  }
});
