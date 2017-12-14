import alert from 'sweetalert2';
import {
  Meteor
} from 'meteor/meteor';
import {
  Template
} from 'meteor/templating';
import {
  Accounts,
  Wallets,
  Shops
} from '/lib/collections';
import verifyPayment from './verifyPayment';
import axios from 'axios';

let paystackKeys = {};
let list = [];
let pageList = [];
let currentPage = 1;
const numberPerPage = 10;
let numberOfPages = 0;

const getNumberOfPages = () => {
  list = Template.instance().state.get('transactionsList');
  if (list.length > 0) {
    return Math.ceil(list.length / numberPerPage);
  }
  return 0;
};

/**
 * @returns {funct} makeList
 * @param {void} null
 */
const makeList = () => {
  const {
    transactions
  } = Template.instance().state.get('details');
  if (transactions.length > 0) {
    const newTranscationDetails = transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    Template.instance().state.set('transactionsList', newTranscationDetails);
    numberOfPages = getNumberOfPages();
  }
};

Template.wallet.onCreated(function bodyOnCreated() {
  this.state = new ReactiveDict();
  this.state.setDefault({
    details: {
      balance: 0,
      transactions: []
    },
    transactions: [],
    transactionsList: [],
    currentPageNum: 1
  });
  this.autorun(() => {
    this.subscribe('myTransactions', Meteor.userId());
    const transactionInfo = Wallets.find().fetch();
    if (transactionInfo.length > 0) {
      this.state.set('details', transactionInfo[0]);
      makeList();
    }
  });
});

/**
 * @returns {funct} check
 * @param {void} null
 */
const check = () => {
  document.getElementById('next').disabled = currentPage === numberOfPages;
  document.getElementById('previous').disabled = currentPage === 1;
  document.getElementById('first').disabled = currentPage === 1;
  document.getElementById('last').disabled = currentPage === numberOfPages;
};

const loadList = () => {
  list = Template.instance().state.get('transactionsList');
  const begin = (currentPage - 1) * numberPerPage;
  const end = begin;
  if (list[0] !== undefined) {
    pageList = list.slice(begin, end);
    Template.instance().state.set('transactions', pageList);
    check();
  }
};

/**
 * @returns {funct} confirmTransfer
 * @param {obj} transaction
 * @param {obj} recipient
 */
function confirmTransfer(transaction, recipient) {
  alert({
    title: 'Do you really want to make this transfer?',
    text: 'It is irreversible.!',
    type: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#DD6B55',
    confirmButtonText: 'Confirm Transfer',
    html: false
  }).then(
    () => {
      Meteor.call(
        'wallet/transaction',
        Meteor.userId(),
        transaction,
        (err, res) => {
          if (res === 2) {
            Alerts.toast(`No user with email ${recipient}`, 'error');
          } else if (res === 1) {
            document.getElementById('recipient').value = '';
            document.getElementById('transferAmount').value = '';
            Alerts.toast('Successfully transfered', 'success');
          } else {
            Alerts.toast('An error occured, please try again', 'error');
          }
        }
      );
    },
    (dismiss) => {
      if (dismiss === 'cancel') {
        alert('Cancelled', 'No charges incurred', 'error');
      }
    }
  );
}

const finalizeDeposit = (paystackMethod) => {
  Meteor.call(
    'wallet/transaction',
    Meteor.userId(),
    paystackMethod.transactions,
    (err, res) => {
      if (res) {
        document.getElementById('depositAmount').value = '';
        Alerts.toast('Your deposit was successful', 'success');
      } else {
        Alerts.toast('An error occured, please try again', 'error');
      }
    }
  );
};

/**
 *
 * @param {String} rawAmount
 * @param {String} exchangeRate
 * @returns {String} exchangedAmount
 */
const loadAmount = (rawAmount, exchangeRate) => {
  const nairaToKoboRate = 100;
  let exchangedAmount = 0;
  if (rawAmount) {
    exchangedAmount = Math.round(rawAmount * exchangeRate * nairaToKoboRate);
  }
  return exchangedAmount;
};

Template.wallet.events({

  'click #first': (event) => {
    event.preventDefault();
    currentPage = 1;
    Template.instance().state.set('currentPageNum', currentPage);
    loadList();
  },
  'click #next': (event) => {
    event.preventDefault();
    currentPage = 1;
    Template.instance().state.set('currentPageNum', currentPage);
    loadList();
  },
  'click #previous': (event) => {
    event.preventDefault();
    currentPage -= 1;
    Template.instance().state.set('currentPageNum', currentPage);
    loadList();
  },
  'click #last': (event) => {
    event.preventDefault();
    currentPage = numberOfPages;
    Template.instance().state.set('currentPageNum', currentPage);
    loadList();
  },

  'submit #deposit': (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(document.getElementById('depositAmount').value, 10);
    const {
      currency
    } = Shops.findOne();
    if (amount < 0) {
      Alerts.toast('Amount to deposit cannot be negative', 'error');
      return false;
    }
    if (amount === 0 || amount === '') {
      Alerts.toast('Please enter a deposit amount greater than zero ', 'error');
      return false;
    }

    Meteor.call('paystack/loadApiKeys', (err, keys) => {
      if (err) {
        Alerts.toast('There was an error processing your request ', 'error');
        return false;
      }
      paystackKeys = keys;
      if (currency === 'USD') {
        axios
          .get(`http://www.apilayer.net/api/live?
    access_key=8b26ed909838b9620281b02618f0a668&
    format=1&
    source=${currency}&
    currencies=NGN`)
          .then((rateResponse) => {
            const exchangeRate = Math.round(rateResponse.data.quotes[`${currency}NGN`]);
            const handler = PaystackPop.setup({
              key: keys.publicKey,
              email: userMail,
              amount: loadAmount(Number(amount), exchangeRate),
              callback: (result) => {
                const type = 'deposit';
                const transactionRef = result.reference;
                if (transactionRef) {
                  verifyPayment(transactionRef, paystackKeys.secretKey, (error, response) => {
                    if (error) {
                      Alerts.toast('Unable to verify payment', 'error');
                    } else if (response.data.status !== 'success') {
                      Alerts.toast('Payment was unsuccessful', 'error');
                    } else {
                      const paystackResponse = response.data;
                      const paystackMethod = {
                        processor: 'Paystack',
                        storedCard: paystackResponse.authorization.last4,
                        method: 'Paystack',
                        transactionId: paystackResponse.reference,
                        currency: paystackResponse.currency,
                        amount,
                        status: paystackResponse.status,
                        mode: 'authorize',
                        createdAt: new Date()
                      };
                      if (type === 'deposit') {
                        paystackMethod.transactions = {
                          amount,
                          referenceId: paystackResponse.reference,
                          date: new Date(),
                          transactionType: 'Credit'
                        };
                        finalizeDeposit(paystackMethod);
                      }
                    }
                  });
                }
              }
            });
            return handler.openIframe();
          });
      } else {
        Alerts.toast('For Optimal performance, change the shop\'s currency to dollar, else contact the admin');
      }
    });
  },

  'submit #transfer': (event) => {
    event.preventDefault();
    const accountDetails = Accounts.find(Meteor.userId()).fetch();
    const userMail = accountDetails[0].emails[0].address;
    const amount = parseInt(
      document.getElementById('transferAmount').value,
      10
    );
    if (amount > Template.instance().state.get('details').balance) {
      Alerts.toast('Insufficient Balance', 'error');
      return false;
    }
    if (amount < 0) {
      Alerts.toast('Transfer amount cannot be negative', 'error');
      return false;
    }
    if (amount === 0 || amount === '') {
      Alerts.toast('Transfer amount cannot be zero ', 'error');
      return false;
    }
    const recipient = document.getElementById('recipient').value;
    if (userMail === recipient) {
      Alerts.toast('You can not transfer to yourself', 'error');
      return false;
    }
    const transaction = {
      amount,
      to: recipient,
      date: new Date(),
      transactionType: 'Debit'
    };
    confirmTransfer(transaction, recipient);
  }
});

Template.wallet.helpers({
  balance() {
    return Template.instance().state.get('details').balance;
  },

  getTransactions() {
    makeList();
    loadList();
    const transactions = Template.instance().state.get('transactions');
    return transactions;
  },
  getCurrentPage() {
    const currentPageNum = Template.instance().state.get('currentPageNum');
    return currentPageNum;
  },
  getAmount() {
    const amount = document.getElementById('depositAmount').value;
    return amount;
  },
  formatDate(date) {
    return moment(date).format('dddd, MMMM Do YYYY, h:mm:ssa');
  }
});
