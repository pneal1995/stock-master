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

class News extends React.Component {
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
        const exchangeRateUrl = `https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${term}&to_currency=USD&apikey=${key}`;
        const daily = `https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${term}&market=USD&apikey=${key}&datatype=csv`;
        if (this.state.value == "") {
            return "enter text"
        }
        Promise.all([
            axios.get(exchangeRateUrl, daily),
            axios.get(daily)
        ]).then(([exchangeRate, daily]) => {
           
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

        return (
            <div>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardBody>
                                <SearchBar
                                    value={value}
                                    onChange={this.handleChange}
                                    onClick={this.handleClick} />
                            </CardBody>
                        </Card>
                    </GridItem>
                </GridContainer>
                <GridContainer>
                    <GridItem xs={12} sm={12} md={12}>
                        <Card>
                            <CardBody>
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
News.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(News));