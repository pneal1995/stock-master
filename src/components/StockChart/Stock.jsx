import React from 'react'
import HighchartsReact from './HighchartsReact.js'

const StockChart = ({ options, highcharts }) => <HighchartsReact
  highcharts={highcharts}
  constructorType={'stockChart'}
  options={options}
/>

export default StockChart