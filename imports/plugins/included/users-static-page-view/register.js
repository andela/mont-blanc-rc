import { Reaction } from '/server/api';

Reaction.registerPackage({
  label: 'more-static-page',
  name: 'more-static-page',
  icon: 'fa fa-shopping-bag',
  autoEnable: true,
  registry: [
    {
      name: 'moreStaticPages',
      template: 'moreStaticPages',
      route: '/moreStaticPages',
      workflow: 'coreWorkflow'
    }
  ]
});
