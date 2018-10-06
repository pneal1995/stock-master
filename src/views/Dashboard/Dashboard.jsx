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
import { KEY } from "../../config"

class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      stocks: [],
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
    const key = KEY;
    const batchQuote = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${term}&apikey=${key}`;
    const intraDay = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${term}&interval=5min&apikey=${key}&datatype=csv`;
    const daily = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${term}&outputsize=full&apikey=${key}&datatype=csv`
    if (this.state.value == ""){
      return "enter text"
    }
    Promise.all([
      axios.get(batchQuote),
      axios.get(intraDay),
      axios.get(daily)
    ]).then(([batch, intra, daily]) => {
      /////////////////////////
      // Batch Quote Sorting //
      /////////////////////////
      let stock = _.flattenDeep(Array.from(batch.data['Stock Quotes']).map((stock) => [stock['1. symbol'], stock['2. price'], stock['3. volume'], stock['4. timestamp']]));

      this.setState((state, props) => {

        return {
          ...state,
          stocks: this.state.stocks.concat([stock])

        }
      })
      this.state.stocks.forEach(i => {
        var names = [i[0]];
        emptyPortfolio.push(names);
      });

      this.props.onAddToPortfolio(this.state.stocks);
      //////////////////////////////////////
      // 5 minute Intra Day Quote Sorting //
      //////////////////////////////////////
      function toTimestamp(strDate) {
        var datum = Date.parse(strDate);
        return datum;
      }
      var csvIntra = Papa.parse(intra.data);
      var dataIntra = csvIntra.data
      var slicedDataIntra = dataIntra.slice(1);

      slicedDataIntra.forEach(i => {
        let oldTime = i.shift()
        let newTime = toTimestamp(oldTime);
        i.unshift(newTime);
        emptyData.push(i);
      });

      emptyData.forEach(i => {
        var parsed = [i[0], Number.parseFloat(i[1]), Number.parseFloat(i[2]), Number.parseFloat(i[3]), Number.parseFloat(i[4]), Number.parseFloat(i[5])];
        finalData.push(parsed);
      });
      emptyData = [];
      finalData.pop();

      finalData = _.sortBy(finalData, "0");
      ////////////////////////////////////////////
      // 20 Years Historical Daily Data Sorting //
      ////////////////////////////////////////////
      let csv = Papa.parse(daily.data);
      var data = csv.data
      var slicedData = data.slice(1);

      slicedData.forEach(i => {
        var oldTime = i.shift()
        var newTime = toTimestamp(oldTime);
        i.unshift(newTime);
        emptyData.push(i);
      });

      emptyData.forEach(i => {
        var parsed = [i[0], Number.parseFloat(i[1]), Number.parseFloat(i[2]), Number.parseFloat(i[3]), Number.parseFloat(i[4]), Number.parseFloat(i[5])];
        finalData.push(parsed);
      });
      finalData.pop();
      finalData = _.sortBy(finalData, "0");
      this.props.onApiData(finalData);

    })
    .catch(error => {
      if (error.response) {
        console.log(error.response);
      }
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
          text: '1day',
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
        keys: ['x', 'open', 'high', 'low', 'close', 'volume'],
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
                  NASDAQ Stocks
            </h4>
                <p className={classes.cardCategoryWhite}>
                  Search stocks with a NASDAQ symbol to populate the components below!
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
    stocks: state.stocks,
    portfolio: state.portfolio

  }
}
function mapDispatchToProps(dispatch) {

  return {
    onApiData: (stocks) => dispatch(apiData(stocks)),
    onAddToPortfolio: (portfolio) => dispatch(addToPortfolio(portfolio))
  }
}
Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
