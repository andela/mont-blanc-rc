/* eslint camelcase: 0 */
import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import {
  AutoForm
} from 'meteor/aldeed:autoform';
import {
  $
} from 'meteor/jquery';
import {
  Reaction
} from '/client/api';
import {
  Cart,
  Shops,
  Packages
} from '/lib/collections';
import {
  Paystack
} from '../../lib/api';
import {
  PaystackPayment
} from '../../lib/collections/schemas';

import './paystack.html';

let submitting = false;

const uiEnd = (template, buttonText) => {
  template.$(':input').removeAttr('disabled');
  template.$('#btn-complete-order').text(buttonText);
  return template.$('#btn-processing').addClass('hidden');
};

const paymentAlert = errorMessage => $('.alert').removeClass('hidden').text(errorMessage);

const hidePaymentAlert = () => $('.alert').addClass('hidden').text('');

const handlePaystackSubmitError = (error) => {
  const serverError = error !== null ? error.message : undefined;
  if (serverError) {
    return paymentAlert(`Oops! ${serverError}`);
  } else if (error) {
    return paymentAlert(`Oops! ${error}`, null, 4);
  }
};

Template.paystackPaymentForm.helpers({
  PaystackPayment() {
    return PaystackPayment;
  }
});

const verifyPayment = (reference, secretKey, form, template, packageData) => {
  Paystack.verify(reference, secretKey, (error, response) => {
    if (error) {
      handlePaystackSubmitError(error);
      uiEnd(template, 'Resubmit payment');
    } else {
      const transaction = response.data;
      submitting = false;
      const paymentMethod = {
        processor: 'Paystack',
        paymentPackageId: packageData._id,
        paymentSettingsKey: packageData.registry[0].settingsKey,
        storedCard: transaction.authorization.card_type,
        method: 'credit',
        transactionId: transaction.reference,
        riskLevel: 'normal',
        currency: transaction.currency,
        amount: transaction.amount / 100,
        status: transaction.status ? 'passed' : 'failed',
        mode: 'authorize',
        createdAt: new Date(),
        transactions: []
      };
      Alerts.toast('Transaction successful');
      paymentMethod.transactions.push(transaction.authorization);
      Meteor.call('cart/submitPayment', paymentMethod);
    }
  });
};

const getExchangeRate = (currency) => {
  let exchangeRate = 0;
  if (currency === 'USD') {
    exchangeRate = 360;
  }
  return exchangeRate;
};

/**
 *
 * @param {String} rawAmount
 * @param {String} currency
 * @returns {String} exchangedAmount
 */
const loadAmount = (rawAmount, currency) => {
  const exchangeRate = getExchangeRate(currency);
  const nairaToKoboRate = 100;
  let exchangedAmount = 0;
  if (rawAmount) {
    exchangedAmount = Math.round(rawAmount * exchangeRate * nairaToKoboRate);
  }
  return exchangedAmount;
};

AutoForm.addHooks('paystack-payment-form', {
  onSubmit(doc) {
    const total = Cart.findOne().getTotal();
    const {
      currency
    } = Shops.findOne();

    const exchangedValue = loadAmount(Number(total), currency);

    submitting = true;
    const {
      template
    } = this;
    hidePaymentAlert();
    const name = doc.payerName;
    const email = doc.payerEmail;
    const form = {
      name,
      email
    };

    /**
     *Get the application packages
     */
    Meteor.subscribe('Packages', Reaction.getShopId());
    const packageData = Packages.findOne({
      name: 'paystack-paymentmethod',
      shopId: Reaction.getShopId()
    });

    /**
     * Load paystack keys from the environment
     */
    Meteor.call('paystack/loadApiKeys', (keysRetrivalError, keysRetrivalResponse) => {
      if (keysRetrivalResponse) {
        const {
          publicKey,
          secretKey
        } = keysRetrivalResponse;

        /**
         * Load the paystack platform
         */
        PaystackPop.setup({
          key: publicKey,
          email,
          amount: exchangedValue,
          callback: (response) => {
            if (response.reference) {
              const {
                reference
              } = response;
              verifyPayment(reference, secretKey, form, template, packageData);
            } else {
              handlePaystackSubmitError(response);
              uiEnd(template, 'Resubmit payment');
            }
          },

          /**
           *  Actions to run when the payment platform is closed
           * @returns {*} void
           */
          onClose: () => {
            const error = 'Payment window closed';
            handlePaystackSubmitError(error);
            uiEnd(template, 'Resubmit payment');
          }
        }).openIframe();
      } else {
        const error = 'Payment window not loaded';
        handlePaystackSubmitError(error);
        uiEnd(template, 'Resubmit payment');
      }
    });
    return false;
  },
  beginSubmit() {
    this.template.$(':input').attr('disabled', true);
    this.template.$('#btn-complete-order').text('Submitting ');
    return this.template.$('#btn-processing').removeClass('hidden');
  },
  endSubmit() {
    if (!submitting) {
      return uiEnd(this.template, 'Complete your order');
    }
  }
});
