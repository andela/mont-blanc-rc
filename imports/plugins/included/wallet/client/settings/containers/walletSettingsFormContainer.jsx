import React, {
  Component
} from 'react';
import PropTypes from 'prop-types';
import {
  composeWithTracker
} from '@reactioncommerce/reaction-components';
import {
  Meteor
} from 'meteor/meteor';
import {
  Packages
} from '/lib/collections';
import {
  TranslationProvider
} from '/imports/plugins/core/ui/client/providers';
import {
  Reaction,
  i18next
} from '/client/api';
import {
  WalletSettingsForm
} from '../components';

/**
 *
 *
 * @class WalletSettingsFormContainer
 * @extends {Component}
 */
class WalletSettingsFormContainer extends Component {
  /**
   * Creates an instance of WalletSettingsFormContainer.
   * @param {any} props
   * @memberof WalletSettingsFormContainer
   */
  constructor(props) {
    super(props);

    this.state = {
      apiKey: '278302390293'
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.saveUpdate = this.saveUpdate.bind(this);
  }

  /**
   *
   *
   * @param {any} e
   * @memberof WalletSettingsFormContainer
   * @returns {*} description
   */
  handleChange(e) {
    e.preventDefault();
    this.setState({
      apiKey: e.target.value
    });
  }

  /**
   *
   *
   * @param {any} settings
   * @memberof WalletSettingsFormContainer
   * @returns {*} description
   */
  handleSubmit(settings) {
    // e.preventDefault();

    const packageId = this.props.packageData._id;
    const { settingsKey } = this.props.packageData.registry[0];

    const fields = [{
      property: 'apiKey',
      value: settings.apiKey
    }, {
      property: 'support',
      value: settings.support
    }];

    this.saveUpdate(fields, packageId, settingsKey);
  }

  /**
   *
   *
   * @param {any} fields
   * @param {any} id
   * @param {any} settingsKey
   * @memberof WalletSettingsFormContainer
   * @returns {*} void
   */
  saveUpdate(fields, id, settingsKey) {
    Meteor.call('registry/update', id, settingsKey, fields, (err) => {
      if (err) {
        return Alerts.toast(i18next.t('admin.settings.saveFailed'), 'error');
      }
      return Alerts.toast(i18next.t('admin.settings.saveSuccess'), 'success');
    });
  }

  /**
   *
   *
   * @returns {Object} render object
   * @memberof WalletSettingsFormContainer
   */
  render() {
    const { settingsKey } = this.props.packageData.registry[0];
    return (
      <TranslationProvider >
        <WalletSettingsForm
          onChange={
            this.handleChange
          }
          onSubmit={
            this.handleSubmit
          }
          settings={
            this.props.packageData.settings[settingsKey]
          }
        />
      </TranslationProvider>
    );
  }
}

WalletSettingsFormContainer.propTypes = {
  packageData: PropTypes.object.isRequired
};

const composer = ({ }, onData) => {
  const subscription = Meteor.subscribe('Packages', Reaction.getShopId());
  if (subscription.ready()) {
    const packageData = Packages.findOne({
      name: 'wallet-paymentmethod',
      shopId: Reaction.getShopId()
    });
    onData(null, {
      packageData
    });
  }
};

export default composeWithTracker(composer)(WalletSettingsFormContainer);
