import { Reaction } from '/server/api';

Reaction.registerPackage({
  label: 'Static-Page-View',
  name: 'static-page-view',
  autoEnable: true,
  registry: [
    {
      route: '/page/:pageAddress',
      name: 'page',
      workflow: 'coreStaticPageWorkflow',
      template: 'staticPageView'
    }
  ],
  layout: [{
    layout: 'coreLayout',
    workflow: 'coreProductWorkflow',
    collection: 'StaticPage',
    theme: 'default',
    enabled: true,
    structure: {
      template: 'staticPageView',
      layoutHeader: 'layoutHeader',
      layoutFooter: '',
      notFound: 'productNotFound',
      dashboardHeader: 'productDetailSimpleToolbar',
      dashboardControls: 'productDetailDashboardControls',
      dashboardHeaderControls: '',
      adminControlsFooter: 'adminControlsFooter'
    }
  }]
});
