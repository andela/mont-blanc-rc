import {
  Shops,
  Products,
  Orders,
  Cart,
  Inventory,
  Emails,
  Accounts,
  Logs,
  Groups,
  Assets,
  Packages,
  Shipping,
  Tags
} from "/lib/collections";
import Reaction  from "/server/api";

const hasPermission = (user, role) => {
  return user.roles[Reaction.getShopId()].includes(role);
};

/**
 * Configure CRUD operation for restful apis
 */
export default () => {
  const Api = new Restivus({
    useDefaultAuth: true,
    prettyJson: true,
    defaultHeaders: {
      "Content-Type": "application/json"
    },
    version: "v1"
  });

  const getRestfulApisOptions = (nameOfCollection) => {
    return {
      routeOptions: {
        authRequired: true
      },

      endpoints: {
        /**
           * Post request
           */
        post: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
               hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to post a collection"
              };
            }
            if (hasPermission(this.user, "admin") ||
            hasPermission(this.user, "owner")) {
              const isPosted = nameOfCollection.insert(this.bodyParams);
              if (!isPosted) {
                return {
                  status: 500,
                  success: false,
                  message: "An error occurred on your post request"
                };
              }
              return {
                status: 201,
                success: true,
                postedData: isPosted
              };
            }
          }
        },

        /**
         * Get request
         */
        get: {
          action() {
            if (hasPermission(this.user, "admin") ||
                  hasPermission(this.user, "owner") ||
                  hasPermission(this.user, "guest")) {
              const records = nameOfCollection.findOne(this.urlParams.id);
              if (!records) {
                return {
                  status: 404,
                  success: false,
                  message: "Records does not exist"
                };
              }
              return {
                status: 200,
                success: true,
                records: records
              };
            }
          }
        },

        /**
         * Update request
         */
        update: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
                hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to update a collection"
              };
            }
            if (hasPermission(this.user, "admin") ||
             hasPermission(this.user, "owner")) {
              const isUpdated = nameOfCollection.upsert({ _id: this.urlParams.id }, {
                $set: this.bodyParams
              });
              if (!isUpdated) {
                return {
                  status: 500,
                  success: false,
                  message: "An error occurred on your update request"
                };
              }
              return {
                status: 200,
                success: true,
                updatedData: isUpdated
              };
            }
          }
        },

        /**
         * Delete Request
         */
        delete: {
          action() {
            if (!(hasPermission(this.user, "admin") ||
                hasPermission(this.user, "owner"))) {
              return {
                status: 403,
                success: false,
                message: "You are forbidden to update a collection"
              };
            }
            if (nameOfCollection._name === "Products") {
              const collection = nameOfCollection.findOne(this.urlParams.id);
              // update isDeleted field in db
              collection.isDeleted = true;
              const deletedCollection = nameOfCollection.upsert({ _id: this.urlParams.id }, {
                $set: collection
              });
              return {
                status: 200,
                deletedData: deletedCollection,
                message: "This product has been archived"
              };
            }
            const deletedCollection = nameOfCollection.remove({ _id: this.urlParams.id });
            return {
              status: 204,
              deletedData: deletedCollection,
              message: "Collection has been deleted"
            };
          }
        }
      }
    };
  };

  /**
   * Add collections
   */
  Api.addCollection(Shops, getRestfulApisOptions(Shops));
  Api.addCollection(Products, getRestfulApisOptions(Products));
  Api.addCollection(Orders, getRestfulApisOptions(Orders));
  Api.addCollection(Cart, getRestfulApisOptions(Cart));
  Api.addCollection(Inventory, getRestfulApisOptions(Inventory));
  Api.addCollection(Emails, getRestfulApisOptions(Emails));
  Api.addCollection(Accounts, getRestfulApisOptions(Accounts));
  Api.addCollection(Logs, getRestfulApisOptions(Logs));
  Api.addCollection(Groups, getRestfulApisOptions(Groups));
  Api.addCollection(Assets, getRestfulApisOptions(Assets));
  Api.addCollection(Tags, getRestfulApisOptions(Tags));
  Api.addCollection(Shipping, getRestfulApisOptions(Shipping));
  Api.addCollection(Packages, getRestfulApisOptions(Packages));
};
