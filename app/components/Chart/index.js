import React, { Component } from 'react';
import { connect } from 'react-redux';
import PieChart from './ChartTypes/PieChart/';

class Chart extends Component {

  constructor() {
    super();
    this._renderChartType = this._renderChartType.bind(this);
  }

  _renderChartType() {
    switch (this.props.data.options.type) {
      case 'pieChart':
        return (
          <PieChart data={this.props.data} />
        );

      default:
        return (
          <span>Unknown chart type: {this.props.data.options.type}</span>
        );
    }
  }

  render() {
    return (
      <div>
        {this._renderChartType()}
      </div>
    );
  }
}

Chart.propTypes = {
  data: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection

export default connect()(Chart);
