import React from 'react';
import $ from 'jquery';
import _ from "lodash";
import { Template } from "meteor/templating";
import { Orders } from "/lib/collections";
import { formatPriceString } from "/client/api";
import { ReactiveDict } from "meteor/reactive-dict";
import { registerComponent } from '@reactioncommerce/reaction-components';
import { ReportSideBar } from '../components/ReportSideBar';
import { RetailDashBoard } from '../components/RetailDashBoard';
import { SalesReport } from '../components/SalesReport';
import { InventoryReport } from '../components/InventoryReport';
import { ProductStat } from '../components/ProductStat';
import { analyseOrder } from '../helpers/analyseOrder';
import { getAverageSales } from '../helpers/getAverageSales';
import { Meteor } from "meteor/meteor";
import { DateTimePicker } from '../components/datePicker/DateTimePicker';





/**
 * @export
 * @class Report
 * @extends {React.Component}
 */
export class Report extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      value:'',
      statValue:'',
      ordersPlaced: 0,
      ordersData: [],
      beforeDate: new Date(),
      afterDate: new Date(),
      totalSales: 0,
      totalItemsPurchased: 0,
      ordersCancelled: 0,
      totalShippingCost: 0,
      salesPerDay: 0,
      analytics: {},
      analyticsStatement: {},
      ordersAnalytics: [],
      productsAnalytics: [],
      fromDate: Date.parse('2017-10-13'),
      toDate: Date.now(),
      dateIsChange: false,
      productInventoryData: [],
      productSearchTerm: '',
      headingText: 'Retail DashBoard',
      displayBar: 'block',
      displayPie: 'none',
      customerDisplayBar: 'none',
      customerDisplayPie: 'none'
    };
  }

  componentDidMount() {
    // fetch product category documents
    this.getAnalytics(this.state.fromDate, this.state.toDate);
  }



  componentDidUpdate() {
    if (this.state.dateIsChange) {
      this.getAnalytics(this.state.fromDate, this.state.toDate);
    }
  }

  getAnalytics = (fromDate, toDate) => {
    Meteor.call("getOrders",
      {
        fromDate: fromDate,
        toDate: toDate
      },
      (errors, ordersFetched) => {
        if (errors) {
          return errors;
        }
        if (ordersFetched) {
          const analyticsItems = analyseOrder(ordersFetched, fromDate, toDate);
          this.setState({
            dateIsChange: false,
            ordersData: ordersFetched,
            ordersPlaced: ordersFetched.length,
            totalSales: analyticsItems.totalSales,
            totalItemsPurchased: analyticsItems.totalItemsPurchased,
            totalShippingCost: analyticsItems.totalShippingCost,
            analytics: analyticsItems.analytics,
            ordersAnalytics: analyticsItems.ordersAnalytics,
            ordersCancelled: analyticsItems.ordersCancelled
          })

          this.setState({
            salesPerDay: getAverageSales(this.state.totalSales, fromDate, toDate)
          })
        }
      });
  }

  getProductInventoryData = (searchTerm) => {
    Meteor.call('getProductInventoryData',
      {
        searchTerm: searchTerm
      }, (errors, fetchedProductInventoryData) => {
        if (errors) {
          return errors;
        }
        this.setState({
          productInventoryData: fetchedProductInventoryData
        });

      })
  }

  handleShowRetailDashBoard = () => {
    this.setState({
      headingText: 'Retail DashBoard'
    });
    $('#tab1').show();
    $('#tab2').hide();
    $('#tab3').hide();
    $('#tab4').hide();
  }
  handleShowSalesReport = () => {
    this.setState({
      headingText: 'Sales Report'
    });
    $('#tab2').show();
    $('#tab1').hide();
    $('#tab3').hide();
    $('#tab4').hide();
  }

  handleShowInventoryReport = () => {
    this.setState({
      headingText: 'Inventory Report'
    });
    $('#tab3').show();
    $('#tab1').hide();
    $('#tab2').hide();
    $('#tab4').hide();
  }
  handleShowProductStats = () => {
    this.setState({
      headingText: 'Products Stats'
    });
    $('#tab4').show();
    $('#tab1').hide();
    $('#tab2').hide();
    $('#tab3').hide();
  }


  handleToDateInputChange = (event) => {
    this.setState({
      toDate: Date.parse(event.target.value),
      dateIsChange: true,
    })
  }

  handleFromDateInputChange = (event) => {
    this.setState({
      fromDate: Date.parse(event.target.value),
      dateIsChange: true
    })
  }

  handleChartChange = (event) => {
   this.setState({
     value: event.target.value
   });
   if ((event.target.value.toString() === 'Bar') && (this.state.statValue === 'sales')) {
     this.setState({
       displayBar: 'block',
       displayPie: 'none',
       customerDisplayBar: 'none',
       customerDisplayPie: 'none'
     })
   }
   else if ((event.target.value.toString() === 'Pie') && (this.state.statValue === 'sales')) {
    this.setState({
      displayPie: 'block',
      displayBar: 'none',
      customerDisplayBar: 'none',
      customerDisplayPie: 'none'
    })
   }
   else if ((event.target.value.toString() === 'Bar') && (this.state.statValue === 'customer')) {
    this.setState({
      displayPie: 'none',
      displayBar: 'none',
      customerDisplayBar: 'block',
      customerDisplayPie: 'none'
    })
   }
   else if ((event.target.value.toString() === 'Pie') && (this.state.statValue === 'customer')) {
    this.setState({
      displayPie: 'none',
      displayBar: 'none',
      customerDisplayBar: 'none',
      customerDisplayPie: 'block'
    })
   }
  }

  handleOptionChange = (event) => {
    this.setState({
      statValue: event.target.value
    })
   }

  handleInventoryInputChange = (event) => {
    this.getProductInventoryData(event.target.value);
  }
  handleSalesInputChange = (event) => {
    this.setState({
      productSearchTerm: event.target.value
    });
  }
  render() {
    return (
      <div className="container-fluid">
        <ReportSideBar
          handleShowRetailDashBoard={this.handleShowRetailDashBoard}
          handleShowSalesReport={this.handleShowSalesReport}
          handleShowInventoryReport={this.handleShowInventoryReport}
          handleShowProductStats={this.handleShowProductStats}
        />
        <div className="row">
          <div className="col-sm-4 col-md-4 col-lg-4 col-lg-offset-1">
            <h3>{this.state.headingText}</h3>
          </div>

          <DateTimePicker
            handleInputChange={this.handleFromDateInputChange}
            sideLabel="FROM"
            dateClass="col-sm-3 report-date from-date"
            inputName="from-date-input"
          />
          <DateTimePicker
            handleInputChange={this.handleToDateInputChange}
            sideLabel="TO"
            dateClass="col-sm-3 report-date"
            inputName="to-date-input"
          />
        </div>

        <RetailDashBoard
          OrdersData={this.state}
        />
        <SalesReport
          productSearchTerm={this.state.productSearchTerm}
          productSalesData={this.state.analytics}
          handleSalesInputChange={this.handleSalesInputChange}
        />
        <InventoryReport
          productInventoryData={this.state.productInventoryData}
          handleInventoryInputChange={this.handleInventoryInputChange}
        />
        <ProductStat 
          salesData={this.state.analytics}
          handleChartChange = {this.handleChartChange}
          handleOptionChange = {this.handleOptionChange}
          statValue = {this.state.statValue}
          value={this.state.value}
          displayBar={this.state.displayBar}
          displayPie= {this.state.displayPie}
          customerDisplayPie= {this.state.customerDisplayPie}
          customerDisplayBar= {this.state.customerDisplayBar}
        />
      </div>
    );
  }
}
registerComponent('Report', Report);
export default Report;
