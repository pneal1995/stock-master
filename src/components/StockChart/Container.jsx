import React from 'react'
import HighchartsReact from './HighchartsReact.js'
import Highcharts from 'highcharts'

export default class Container extends React.Component {
  constructor () {
    super()
    this.state = { data: [] }

  }

  render () {
    const cb = function () {}
    
    return (
      <div>
        <HighchartsReact
          highcharts={Highcharts}
          options={{ series: [{ data: this.state.data }], chart: { events: { load: cb } } }}
          constructorType={'chart'}
        />
      </div>
    )
  }
}
