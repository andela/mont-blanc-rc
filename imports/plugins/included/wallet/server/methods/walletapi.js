import {
  ValidatedMethod
} from 'meteor/mdg:validated-method';
import {
  SimpleSchema
} from 'meteor/aldeed:simple-schema';
import {
  Random
} from 'meteor/random';
import {
  registerSchema
} from '@reactioncommerce/reaction-collections';

  // Test card to use to add risk level flag for testing purposes only.
export const RISKY_TEST_CARD = '4000000000009235';

// You should not implement ThirdPartyAPI. It is supposed to represent your third party API
// And is called so that it can be stubbed out for testing. This would be a library
// like Stripe or Authorize.net usually just included with a NPM.require

const ThirdPartyAPI = {
  authorize(transactionType, cardData, paymentData) {
    if (transactionType === 'authorize') {
      const results = {
        success: true,
        id: Random.id(),
        amount: paymentData.total,
        currency: 'USD'
      };
      return results;
    }
    return {
      success: false
    };
  },
  capture(authorizationId, amount) {
    return {
      authorizationId,
      amount,
      success: true
    };
  },
  refund(transactionId, amount) {
    return {
      success: true,
      transactionId,
      amount
    };
  },
  listRefunds(transactionId) {
    return {
      transactionId,
      refunds: [{
        type: 'refund',
        amount: 3.99,
        created: 1454034562000,
        currency: 'usd',
        raw: {}
      }]
    };
  }
};

  // This is the "wrapper" functions you should write in order to make your code more
  // testable. You can either mirror the API calls or
  // normalize them to the authorize/capture/refund/refunds
  // that Reaction is expecting
export const WalletApi = {};
WalletApi.methods = {};

export const cardSchema = new SimpleSchema({});

registerSchema('cardSchema', cardSchema);

export const paymentDataSchema = new SimpleSchema({
  total: {
    type: String
  },
  currency: {
    type: String
  }
});

registerSchema('paymentDataSchema', paymentDataSchema);

WalletApi.methods.authorize = new ValidatedMethod({
  name: 'WalletApi.methods.authorize',
  validate: new SimpleSchema({
    transactionType: {
      type: String
    },
    cardData: {
      type: cardSchema
    },
    paymentData: {
      type: paymentDataSchema
    }
  }).validator(),
  run({
    transactionType,
    cardData,
    paymentData
  }) {
    const results = ThirdPartyAPI.authorize(transactionType, cardData, paymentData);
    return results;
  }
});

WalletApi.methods.capture = new ValidatedMethod({
  name: 'WalletApi.methods.capture',
  validate: new SimpleSchema({
    authorizationId: {
      type: String
    },
    amount: {
      type: Number,
      decimal: true
    }
  }).validator(),
  run(args) {
    const transactionId = args.authorizationId;
    const {
      amount
    } = args;
    const results = ThirdPartyAPI.capture(transactionId, amount);
    return results;
  }
});

WalletApi.methods.refund = new ValidatedMethod({
  name: 'WalletApi.methods.refund',
  validate: new SimpleSchema({
    transactionId: {
      type: String
    },
    amount: {
      type: Number,
      decimal: true
    }
  }).validator(),
  run(args) {
    const {
      transactionId,
      amount
    } = args;
    const results = ThirdPartyAPI.refund(transactionId, amount);
    return results;
  }
});

WalletApi.methods.refunds = new ValidatedMethod({
  name: 'WalletApi.methods.refunds',
  validate: new SimpleSchema({
    transactionId: {
      type: String
    }
  }).validator(),
  run(args) {
    const {
      transactionId
    } = args;
    const results = ThirdPartyAPI.listRefunds(transactionId);
    return results;
  }
});
