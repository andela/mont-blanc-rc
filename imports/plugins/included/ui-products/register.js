import { Reaction } from '/server/api';

Reaction.registerPackage({
  label: 'Products UI',
  name: 'uiproducts',
  icon: 'fa fa-shopping-bag',
  autoEnable: true,
  registry: [
    {
      name: 'uiProducts',
      template: 'uiProducts',
      route: '/uiProducts',
      workflow: 'coreWorkflow'
    }
  ]
});
