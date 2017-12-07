import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Digital Products UI",
  name: "reaction-digital-products",
  icon: "fa fa-shopping-bag",
  autoEnable: true,
  registry: [
    {
      name: "Digital Products",
      provides: ["ui-digital-products"],
      template: "digitalProducts"
    }
  ]
});
