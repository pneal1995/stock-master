import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import apiData from '../../actions/apiData'
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
    let term = this.state.value;
    const key = '8JCH8R83D5Z8SNQA';
    const batchQuote = `https://www.alphavantage.co/query?function=BATCH_STOCK_QUOTES&symbols=${term}&apikey=${key}`;
    const intraDay = `https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=${term}&interval=5min&apikey=${key}&datatype=csv`;

    axios.get(batchQuote)
      
      .then(res => {
        
          let stock = _.flattenDeep(Array.from(res.data['Stock Quotes']).map((stock) => [stock['1. symbol'], stock['2. price'], stock['3. volume'], stock['4. timestamp']]));

          this.setState((state, props) => {
  
            return {
              ...state,
              stocks: this.state.stocks.concat([stock])
  
            }
          })
        
        
      })
      .catch(error => console.log(error.response))
      .then
    axios.get(intraDay)
      .then(res => {
        var csv = Papa.parse(res.data);
        var data = csv.data
        var slicedData = data.slice(1);

        slicedData.forEach(i => {
          var oldTime = i.shift()
          var newTime = toTimestamp(oldTime);
          var finalArray = i.unshift(newTime);
          emptyData.push(i);
        });

        emptyData.forEach(i => {
          var parsed = [i[0], Number.parseFloat(i[1]), Number.parseFloat(i[2]), Number.parseFloat(i[3]), Number.parseFloat(i[4]), Number.parseFloat(i[5])];
          finalData.push(parsed);
        });
        finalData.pop();
        
        finalData = _.sortBy(finalData,"0");
        console.log(finalData);
        this.props.onApiData(finalData);




        function toTimestamp(strDate) {
          var datum = Date.parse(strDate);
          return datum;
        }


      })
      .catch(error => console.log(error.response))
  }


  render() {
    const { classes } = this.props;
    let stocks = this.state.stocks;
    const value = this.state.value;

    const stockOptions = {
      chart: {
        type: 'candlestick',
        zoomType: 'x',
      },
      title: {
        text: this.state.term
      },
      rangeSelector: {
        buttons: [{
          type: 'all',
				  text: 'All'
        }],
        selected: 'all' // all
      },
      yAxis: [{
        height: '75%',
        labels: {
          align: 'right',
          x: -3

        },
        title: {
          text: 'Price'
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
          day: '%d %b, %Y %H:%M:%S'    
       },
        units: [[
          'millisecond', // unit name
          [1, 2, 5, 10, 20, 25, 50, 100, 200, 500] // allowed multiples
        ], [
          'second',
          [1, 2, 5, 10, 15, 30]
        ], [
          'minute',
          [1, 2, 5, 10, 15, 30]
        ], [
          'hour',
          [1, 2, 3, 4, 6, 8, 12]
        ], [
          'day',
          [1]
        ], [
          'week',
          [1]
        ]],
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
          enabled: false
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
                NASDAQ Query
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
                tableHeaderColor="black"
                tableHead={["Symbol", "Price", "Volume", "Timestamp"]}
                tableData={stocks

                }
              />
            
      <HighchartsReact
        highcharts={Highcharts}
        constructorType={'stockChart'}
        options={stockOptions}
      />
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
    stocks: state.stocks
  }
}
function mapDispatchToProps(dispatch) {

  return {
    onApiData: (stocks) => dispatch(apiData(stocks))
  }
}


Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(Dashboard));
