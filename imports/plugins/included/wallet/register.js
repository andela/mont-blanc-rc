import { Reaction } from '/server/api';

Reaction.registerPackage({
  label: 'wallet UI',
  name: 'wallet',
  icon: 'fa fa-shopping-bag',
  autoEnable: true,
  registry: [
    {
      name: 'wallet',
      template: 'wallet',
      route: '/wallet'
    }]
});

