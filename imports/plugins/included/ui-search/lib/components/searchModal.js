import React, { Component } from "react";
import PropTypes from "prop-types";
import { Reaction } from "/client/api";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";


class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    handleAccountClick: PropTypes.func,
    handleChange: PropTypes.func,
    handleClick: PropTypes.func,
    handleTagClick: PropTypes.func,
    handleToggle: PropTypes.func,
    products: PropTypes.array,
    siteName: PropTypes.string,
    tags: PropTypes.array,
    unmountMe: PropTypes.func,
    value: PropTypes.string
  }

  state = {
    categories: []
  }

  productTypeChange = event => {
    const categories = {
      Country: [{ key: "Nigeria", value: "NG" }, { key: "Morocco", value: "MA" },
        { key: "USA", value: "US" }, { key: "Brazil", value: "BR" },
        { key: "England", value: "EN" } ],
      Digital: [{ key: "Music" }, { key: "Video" }],
      NonDigital: [{ key: "Electronics" }, { key: "Shirts" }, { key: "Shoes" }]
    };
    this.setState({ categories: categories[event.target.value] });
  }

  renderSearchInput() {
    return (
      <div className="rui search-modal-input">
        <label data-i18n="search.searchInputLabel">Search {this.props.siteName}</label>
        <i className="fa fa-search search-icon" />
        <TextField
          className="search-input"
          textFieldStyle={{ marginBottom: 0 }}
          onChange={this.props.handleChange}
          value={this.props.value}
        />
        <Button
          className="search-clear"
          i18nKeyLabel="search.clearSearch"
          label="Clear"
          containerStyle={{ fontWeight: "normal" }}
          onClick={this.props.handleClick}
        />
      </div>
    );
  }

  renderProductTypeFilter() {
    const productTypes = ["Country", "Digital", "NonDigital"];

    return (
      <div>
        <select
          onChange={this.productTypeChange}
          className="col-lg-3"
        >
          <option>--select product type--</option>
          {productTypes.map((productType, i) =>
            <option key={i}>{productType}</option>
          )}
        </select>
      </div>
    );
  }

  renderProductCategoryFilter() {
    return (
      <div>
        <select
          className="col-lg-3"
        >
          <option>--select category--</option>
          {this.state.categories.map((category, i) =>
            <option key={i} value={(category.value) ? category.value : category.key}>{category.key}</option>
          )}
        </select>
      </div>
    );
  }

  renderProductSort() {
    const sorts = ["Price: low-high", "Price: high-low", "Date: new-old", "Date: old-new"];

    return (
      <div>
        <select
          value={this.props.value}
          className="col-lg-3"
        >
          <option>--sort--</option>
          {sorts.map((sort, i) =>
            <option key={i}>{sort}</option>
          )}
        </select>
      </div>
    );
  }

  renderSearchTypeToggle() {
    if (Reaction.hasPermission("admin")) {
      return (
        <div className="rui search-type-toggle">
          <div
            className="search-type-option search-type-active"
            data-i18n="search.searchTypeProducts"
            data-event-action="searchCollection"
            data-event-value="products"
            onClick={() => this.props.handleToggle("products")}
          >
            Products
          </div>
          {Reaction.hasPermission("accounts") &&
            <div
              className="search-type-option"
              data-i18n="search.searchTypeAccounts"
              data-event-action="searchCollection"
              data-event-value="accounts"
              onClick={() => this.props.handleToggle("accounts")}
            >
              Accounts
            </div>
          }
        </div>
      );
    }
  }

  renderProductSearchTags() {
    return (
      <div className="rui search-modal-tags-container">
        <p className="rui suggested-tags" data-i18n="search.suggestedTags">Suggested tags</p>
        <div className="rui search-tags">
          {this.props.tags.map((tag) => (
            <span
              className="rui search-tag"
              id={tag._id} key={tag._id}
              onClick={() => this.props.handleTagClick(tag._id)}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    return (
      <div>
        <div className="rui search-modal-close"><IconButton icon="fa fa-times" onClick={this.props.unmountMe} /></div>
        <div className="rui search-modal-header">
          {this.renderSearchInput()}
          {this.renderSearchTypeToggle()}
          {this.props.tags.length > 0 && this.renderProductSearchTags()}
        </div>
        <div className="row filtersort">
          {this.renderProductTypeFilter()}
          {this.renderProductCategoryFilter()}
          {this.renderProductSort()}
        </div>
        <div className="rui search-modal-results-container">
          {this.props.products.length > 0 &&
            <ProductGridContainer
              products={this.props.products}
              unmountMe={this.props.unmountMe}
              isSearch={true}
            />
          }
          {this.props.accounts.length > 0 &&
            <div className="data-table">
              <div className="table-responsive">
                <SortableTableLegacy
                  data={this.props.accounts}
                  columns={accountsTable()}
                  onRowClick={this.props.handleAccountClick}
                />
              </div>
            </div>
          }
        </div>
      </div>
    );
  }
}

export default SearchModal;
