import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Featured Products UI",
  name: "reaction-featured-products",
  icon: "fa fa-shopping-bag",
  autoEnable: true,
  registry: [
    {
      name: "Featured Products",
      provides: ["ui-featured-products"],
      template: "featuredProducts"
    }
  ]
});
