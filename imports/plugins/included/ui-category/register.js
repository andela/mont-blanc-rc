import { Reaction } from '/server/api';

Reaction.registerPackage({
  label: 'Category UI',
  name: 'category',
  icon: 'fa fa-shopping-bag',
  autoEnable: true,
  registry: [
    {
      name: 'category',
      template: 'category',
      route: '/category',
      workflow: 'coreProductWorkflow'
    }]
});
