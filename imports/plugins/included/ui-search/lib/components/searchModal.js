import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { Meteor } from "meteor/meteor";
import { Reaction } from "/client/api";
import { TextField, Button, IconButton, SortableTableLegacy } from "@reactioncommerce/reaction-ui";
import ProductGridContainer from "/imports/plugins/included/product-variant/containers/productGridContainer";
import { accountsTable } from "../helpers";
import { Components } from "@reactioncommerce/reaction-components";

class SearchModal extends Component {
  static propTypes = {
    accounts: PropTypes.array,
    displayFilter: PropTypes.string,
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
    categories: [],
    nonDigitalProductArray: [],
    digitalProductArray: [],
    productsArray: [],
    searchRequested: false,
    reversedSortedArray: [],
    sorted: false,
  }

  componentDidMount() {
    // fetch product category documents
    Meteor.call("productCategory", (errors, result) => {
      if (errors) {
        return errors;
      }
      // Updates state of nondigital and digital product categories and products
      this.setState({
        // filters non digital product categories
        nonDigitalProductArray: _.filter(result, ["isDigital", false]),
        // filters digital product categories
        digitalProductArray: _.filter(result, ["isDigital", true]),
        productsArray: this.props.products
      });
    });
  }


  componentWillReceiveProps(nextProps) {
    // Update productsArray when there's search update
    this.setState({
      productsArray: nextProps.products,
      searchRequested: true,
      sorted: false
    });
  }
  componentWillUnmount() {
    this.setState({
      searchRequested: false
    })
  }
  // it listens to onchange event on product type select
  productTypeChange = (event) => {
    let filterTerm;
    // Product categories object
    const categories = {
      Digital: this.state.digitalProductArray,
      NonDigital: this.state.nonDigitalProductArray
    };
    // filter and update products by product types
    if (event.target.value.toString() === "Digital") {
      filterTerm = "digital";
    } else {
      filterTerm = "nonDigital";
    }
    this.setState({
      categories: categories[event.target.value],
      productsArray: _.filter(this.props.products, ["productType", filterTerm]),
      sorted: false
    });
  }
  // filters product by category
  productCategoryFilterChange = (event) => {
    if (event.target.value.toString() !== "--select category--") {
      this.setState({
        productsArray: _.filter(this.props.products, ["productCategory", event.target.value]),
        sorted: false
      });
    }
  };
  // sort products by price and date
  productSortChange = (event) => {
    // check if sorted product array is to be reversed
    let validityCheck = false;
    const sortTypeArray = ["price", "price", "updatedAt", "updatedAt"];
    const sortedProductsArray = _.sortBy(this.state.productsArray, [sortTypeArray[event.target.value]]);
    const reversedSortedArray = _.sortBy(this.state.productsArray, [sortTypeArray[event.target.value]]);
    if (event.target.value === "1" || event.target.value === "2") {
      validityCheck = true;
    }
    {
      this.setState({
        reversedSortedArray: validityCheck ? _.reverse(reversedSortedArray) : sortedProductsArray,
        sorted: true
      });
    }
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
    const productTypes = ["Digital", "NonDigital"];

    return (

      <select
        onChange={this.productTypeChange}
        className="col-lg-3"
      >
        <option>--select product type--</option>
        {productTypes.map((productType, i) =>
          <option key={i}>{productType}</option>)}
      </select>
    );
  }

  renderProductCategoryFilter() {
    const options = _.map(this.state.categories, (val, key) =>
      <option key={key} value={val.title}>{val.title}</option>);

    return (

      <select
        className="col-lg-3"
        onChange={this.productCategoryFilterChange}
      >
        <option>--select category--</option>
        {options}
      </select>

    );
  }

  renderProductSort() {
    const sorts = ["Price: low-high", "Price: high-low", "Date: new-old", "Date: old-new"];

    return (

      <select
        className="col-lg-3"
        onChange={this.productSortChange}
      >
        <option>--sort--</option>
        {sorts.map((sort, index) =>
          <option key={index} value={index.toString()} >{sort}</option>
        )}
      </select>);
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
        </div> <br />
        <div style={{ display: this.props.displayFilter }} className="row filtersort col-lg-12">
          {this.renderProductTypeFilter()}
          {this.renderProductCategoryFilter()}
          {this.renderProductSort()}
        </div>
        <div className="rui search-modal-results-container">
          {this.state.productsArray.length > 0 &&
            <ProductGridContainer
              products={this.state.sorted ? this.state.reversedSortedArray : this.state.productsArray}
              unmountMe={this.props.unmountMe}
              isSearch={true}
            />
          }
          {
            this.state.productsArray.length === 0
            &&
            this.state.searchRequested
            &&
            <div>
              <Components.NotFound
                i18nKeyTitle="order.notFound"
                icon="fa fa-frown-o"
                title=" No Search Result"
              />
            </div>
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
