import {
  SimpleSchema
} from "meteor/aldeed:simple-schema";
import {
  PackageConfig
} from "/lib/collections/schemas/registry";
import {
  registerSchema
} from "@reactioncommerce/reaction-collections";

export const PaystackPackageConfig = new SimpleSchema([
  PackageConfig, {
    "settings.mode": {
      type: Boolean,
      defaultValue: true
    },
    "settings.apiKey": {
      type: String,
      label: "API Key",
      optional: true
    }
  }
]);

registerSchema("PaystackPackageConfig", PaystackPackageConfig);

export const PaystackPayment = new SimpleSchema({
  payerName: {
    type: String,
    label: "Cardholder name"
  },
  payerEmail: {
    type: String,
    label: "Cardholder Email"
  }
});

registerSchema("PaystackPayment", PaystackPayment);
