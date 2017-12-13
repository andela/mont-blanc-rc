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
  Packages,
  Accounts,
  Wallets
} from '/lib/collections';
import {
  Wallet
} from '../../lib/api';
import {
  WalletPayment
} from '../../lib/collections/schemas';

import './wallet.html';

let submitting = false;

/**
 *
 *
 * @param {any} template
 * @param {any} buttonText
 * @returns {Object} template
 */
function uiEnd(template, buttonText) {
  template.$(':input').removeAttr('disabled');
  template.$('#btn-complete-order').text(buttonText);
  return template.$('#btn-processing').addClass('hidden');
}

/**
 *
 *
 * @param {any} errorMessage
 * @returns {Object} payment alert object
 */
function paymentAlert(errorMessage) {
  return $('.alert').removeClass('hidden').text(errorMessage);
}

/**
 *
 *
 * @returns {Object} alert object
 */
function hidePaymentAlert() {
  return $('.alert').addClass('hidden').text('');
}

/**
 *
 *
 * @param {any} error
 * @returns {Object} alert object
 */
function handleWalletSubmitError(error) {
  const serverError = error !== null ? error.message : 'undefined';
  if (serverError) {
    return paymentAlert(`Oops! ${serverError}`);
  } else if (error) {
    return paymentAlert(`Oops! ${error}`, null, 4);
  }
}

Template.walletPaymentForm.helpers({
  WalletPayment() {
    return WalletPayment;
  }
});

const authorizePayment = (form, template, storedCard, packageData, userId) => {
  Wallet.authorize(form, {
    total: Cart.findOne().getTotal(),
    currency: Shops.findOne().currency
  }, (error, transaction) => {
    submitting = false;
    let paymentMethod;
    if (error) {
      handleWalletSubmitError(error);
      uiEnd(template, 'Resubmit payment');
    } else if (transaction.saved === true) {
      submitting = false;
      paymentMethod = {
        processor: 'Wallet',
        paymentPackageId: packageData._id,
        paymentSettingsKey: packageData.registry[0].settingsKey,
        storedCard,
        method: 'credit',
        transactionId: transaction.transactionId,
        riskLevel: transaction.riskLevel,
        currency: transaction.currency,
        amount: transaction.amount,
        status: transaction.status,
        mode: 'authorize',
        createdAt: new Date(),
        transactions: []
      };
      paymentMethod.transactions.push(transaction.response);
      Meteor.call(
        'wallet/transaction',
        userId, {
          amount: transaction.amount,
          referenceId: transaction.transactionId,
          date: new Date(),
          transactionType: 'Debit'
        },
        (err, res) => {
          if (err) {
            return Alerts.toast('Checkout with wallet failed!');
          }
          Meteor.call('cart/submitPayment', paymentMethod);
          Alerts.toast('Order successfully checked out with wallet!');
        }
      );
    } else {
      handleWalletSubmitError(transaction.error);
      uiEnd(template, 'Resubmit payment');
    }
  });
};

AutoForm.addHooks('wallet-payment-form', {
  onSubmit(doc) {
    submitting = true;
    const {
      template
    } = this;
    hidePaymentAlert();

    const orderTotal = Cart.findOne().getTotal();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const {
      userId
    } = accountDetails[0];
    const form = {};
    const storedCard = '';
    Meteor.subscribe('Packages', Reaction.getShopId());
    const packageData = Packages.findOne({
      name: 'wallet-paymentmethod',
      shopId: Reaction.getShopId()
    });
    Alerts.alert({
      title: 'Wallet Checkout',
      text: 'Are you sure you want to checkout with wallet?',
      showCancelButton: true,
    }, () => {
      Meteor.call('wallet/getWalletDetails', (walletError, walletResponse) => {
        if (walletResponse.length === 0) {
          Alerts.toast('You have insufficient balance in your wallet');
          return uiEnd(template, 'Checkout with Wallet');
        }
        const walletBalance = walletResponse[0].balance;
        if (orderTotal > walletBalance) {
          uiEnd(template, 'Checkout with Wallet');
          Alerts.toast('You have insufficient balance in your wallet');
        } else {
          authorizePayment(form, template, storedCard, packageData, userId);
        }
      });
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
