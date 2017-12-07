import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Start Shopping UI",
  name: "reaction-start-shopping",
  icon: "fa fa-shopping-bag",
  autoEnable: true,
  registry: [
    {
      name: "Start Shopping",
      provides: ["ui-start-shopping"],
      template: "startShopping"
    }
  ]
});
