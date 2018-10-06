import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import apiData from '../../actions/apiData'
import addToPortfolio from '../../actions/addToPortfolio'
import _ from 'lodash';
import axios from 'axios';
import Papa from 'papaparse';
import Highcharts from 'highcharts/highstock';
import HighchartsReact from 'components/StockChart/HighchartsReact.js'
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import SearchBar from "components/SearchBar/SearchBar.js";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";
import CustomInput from "components/CustomInput/CustomInput.jsx"
import { throws } from "assert";

class Crypto extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      crypto: [],
      term: null,
      value: ''
    };

    this.handleClick = this.handleClick.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(e) {
    this.setState({
      value: e.target.value
    });
  }

  handleClick(e) {
    if (e) e.preventDefault();
    

    this.setState({
      value: '',
      term: this.state.value
    });

    let emptyData = [];
    let finalData = [];
    let emptyPortfolio = [];
    let term = this.state.value;
    const key = '8JCH8R83D5Z8SNQA';
    const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${term}&to_currency=USD&apikey=${key}`;
    const daily = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${term}&market=USD&apikey=${key}&datatype=csv`;
    if (this.state.value == ""){
      return "enter text"
    }
    Promise.all([
      axios.get(exchangeRateUrl, daily),
      axios.get(daily)
    ]).then(([exchangeRate, daily]) => {
      ///////////////////////////////////
      // Crypto Exchange Rate Sorting //
      //////////////////////////////////
     let data = exchangeRate.data['Realtime Currency Exchange Rate']
     let arr = _.values(data)
      this.setState((state, props) => {

        return {
          ...state,
          crypto: this.state.crypto.concat([arr])

        }
      })
    //   console.log(this.state.crypto)
      this.state.crypto.forEach(i => {
        var names = [i[1], "", i[4], i[5]];
        emptyPortfolio.push(names);
      });

      this.props.onAddToPortfolio(emptyPortfolio);
      //////////////////////////////////////
      // 5 minute Intra Day Quote Sorting //
      //////////////////////////////////////
      function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum;
      }
    let dailyArr = Papa.parse(daily.data)
    var dataIntra = dailyArr.data

      var slicedDataIntra = dataIntra.slice(1);

      slicedDataIntra.forEach(i => {
        let oldTime = i.shift()
        let newTime = toTimestamp(oldTime);
        i.unshift(newTime);
        emptyData.push(i);
      });

      emptyData.forEach(i => {
        var parsed = [i[0], Number.parseFloat(i[1]), Number.parseFloat(i[2]), Number.parseFloat(i[3]), Number.parseFloat(i[4]), Number.parseFloat(i[5]), Number.parseFloat(i[6]), Number.parseFloat(i[7]), Number.parseFloat(i[8]), Number.parseFloat(i[9]), Number.parseFloat(i[10])];
        finalData.push(parsed);
      });
      emptyData = [];
      finalData.pop();

      finalData = _.sortBy(finalData, "0");
      console.log(finalData)
      this.props.onApiData(finalData);
      console.log(emptyPortfolio)
      console.log(dataIntra)
      ////////////////////////////////////////////
      // 20 Years Historical Daily Data Sorting //
      ////////////////////////////////////////////
    //   let csv = Papa.parse(daily.data);
    //   var data = csv.data
    //   var slicedData = data.slice(1);

    //   slicedData.forEach(i => {
    //     var oldTime = i.shift()
    //     var newTime = toTimestamp(oldTime);
    //     i.unshift(newTime);
    //     emptyData.push(i);
    //   });

    //   emptyData.forEach(i => {
    //     var parsed = [i[0], Number.parseFloat(i[1]), Number.parseFloat(i[2]), Number.parseFloat(i[3]), Number.parseFloat(i[4]), Number.parseFloat(i[5])];
    //     finalData.push(parsed);
    //   });
    //   finalData.pop();
    //   finalData = _.sortBy(finalData, "0");
    //   this.props.onApiData(finalData);
      
    // })
    // .catch(error => {
    //   if (error.response) {
    //     console.log(error.response);
    //   }
    });
  }
 

  render() {
    const { classes } = this.props;
    const value = this.state.value;
    const stockOptions = {
      chart: {
        type: 'candlestick',
        zoomType: 'x',
      },
      title: {
        text: this.state.term || "Enter a ticker symbol above to load the graph..."
      },
      rangeSelector: {
        buttons: [{
          type: 'day',
          count: 4 / 3,
          text: '1d',
        }, {
          type: 'month',
          count: 1,
          text: '1m'
        }, {
          type: 'month',
          count: 3,
          text: '3m'
        }, {
          type: 'ytd',
          text: 'YTD'
        }, {
          type: 'year',
          count: 1,
          text: '1y'
        }, {
          type: 'all',
          text: 'All'
        }]
      },
      yAxis: [{
        height: '75%',
        labels: {
          align: 'right',
          x: -3

        },
        title: {
          text: this.state.term
        }
      }, {
        top: '75%',
        height: '25%',
        labels: {
          align: 'right',
          x: -3
        },
        offset: 0,
      }],
      xAxis: {
        type: 'datetime',
        dateTimeLabelFormats: {
          day: '%d %b, %Y %H:%M'
        },
        units: [[
          'minute',
          [5, 10, 15, 30]
        ], [
          'hour',
          [1, 2, 3, 4, 6, 8, 12]
        ], [
          'day',
          [1]
        ], [
          'week',
          [1]
        ],
        [
          'year',
          [1]
        ]
        ],
        series: {
          data: this.props.stocks
        },
        labels: {
          align: 'left',
        }
      },
      series: {
        data: this.props.stocks,
        name: this.state.term + ' Stock Price',
        id: 'this.state.term',
        keys: ["x", "open", "high", "low", "close", "open", "high", "low", "close", "volume", "market cap"],
        dataGrouping: {
          enabled: true
        }
      }
    }

    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
              <CardHeader color="primary">
                <h4 className={classes.cardTitleWhite}>
                  Crypto Currency
            </h4>
                <p className={classes.cardCategoryWhite}>
                  Search Crypto with their symbol to populate the components below!
            </p>
              </CardHeader>
              <CardBody>
                <SearchBar
                  value={value}
                  onChange={this.handleChange}
                  onClick={this.handleClick} />
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Symbol", "Price", "Volume", "Timestamp"]}
                //   tableHead={["Currency", "Code", "To Currency", "Exchange Rate", "Open", "High", "Low", "Close", "Volume", "Market cap", "Timestamp"]}
                  tableData={this.props.portfolio} />
                <HighchartsReact
                  highcharts={Highcharts}
                  constructorType={'stockChart'}
                  options={stockOptions} />
              </CardBody>
            </Card>
          </GridItem>
        </GridContainer>
      </div >
    );
  }
}
function mapStateToProps(state) {
  return {
    crypto: state.crypto,
    portfolio: state.portfolio

  }
}
function mapDispatchToProps(dispatch) {

  return {
    onApiData: (crypto) => dispatch(apiData(crypto)),
    onAddToPortfolio: (portfolio) => dispatch(addToPortfolio(portfolio))
  }
}
Crypto.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(Crypto));