import { Reaction } from "/server/api";

Reaction.registerPackage({
  label: "Carousel UI",
  name: "reaction-index-carousel",
  icon: "fa fa-desktop",
  autoEnable: true,
  registry: [
    {
      name: "Index Carousel",
      provides: ["ui-carousel"],
      template: "indexCarousel"
    }
  ]
});
