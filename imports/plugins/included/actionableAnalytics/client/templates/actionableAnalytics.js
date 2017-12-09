import { Template } from "meteor/templating";
import { Report } from '../containers/Report';
/*
 * searchModal helpers
 */
Template.analytics.helpers({
  displayReport() {
    return {
      component: Report
    };
  }
});
