import React from "react";
import PropTypes from "prop-types";
import { connect } from 'react-redux';
import apiData from '../../actions/apiData'
import addToPortfolio from '../../actions/addToPortfolio'
import GridItem from "components/Grid/GridItem.jsx";
import GridContainer from "components/Grid/GridContainer.jsx";
import Table from "components/Table/Table.jsx";
import Card from "components/Card/Card.jsx";
import CardHeader from "components/Card/CardHeader.jsx";
import CardBody from "components/Card/CardBody.jsx";
import withStyles from "@material-ui/core/styles/withStyles";
import dashboardStyle from "assets/jss/material-dashboard-react/views/dashboardStyle.jsx";


class Portfolio extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
        stocks: [],
        title: ''
        
    };
    

}
componentDidMount(){
    if (this.props.portfolio === undefined) {
        this.setState({
            title: 'Add assets to your portfolio so that you can see them!'
        })
    }else{
        this.setState({
            title: 'Your Portfolio'
        })
    }
}

  render() {
    const { classes } = this.props;
    
    return (
      <div>
        <GridContainer>
          <GridItem xs={12} sm={12} md={12}>
            <Card>
            <CardHeader color="info">
                <h4 className={classes.cardTitleWhite}>
                  {this.state.title}
            </h4>
            </CardHeader>
              <CardBody>
                <Table
                  tableHeaderColor="primary"
                  tableHead={["Symbol", "Price", "Volume", "Timestamp"]}
                  tableData={this.props.portfolio} />
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

Portfolio.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(dashboardStyle)(connect(mapStateToProps, mapDispatchToProps)(Portfolio));