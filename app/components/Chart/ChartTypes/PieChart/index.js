import React, { Component } from 'react';
import { connect } from 'react-redux';
import actionTrigger from '../../../../actions';
import { RECEIVE_CHART_OPTIONS } from '../../../../constants';
import NVD3Chart from 'react-nvd3';
import update from 'react-addons-update';

class PieChart extends Component {

  constructor() {
    super();
    this.defaultOptions = {
      type: 'pieChart',
      height: 400,
      x: (d) => d.label,
      y: (d) => d.value,
      showLegend: false,
      showLabels: false,
    };
  }

  componentWillMount() {
    this.props.dispatch(actionTrigger(RECEIVE_CHART_OPTIONS,
      update(this.defaultOptions, { $merge: this.props.options })
    ));
  }

  render() {
    // Merge passed options into defaults

    // Add chart data
    args.datum = this.props.data;

    return (
      <div>
        {React.createElement(NVD3Chart, update(
          this.props.options, { $merge: { datum: this.props.data }}
        ))}
      </div>
    );
  }
}

PieChart.propTypes = {
  data: React.PropTypes.array,
  options: React.PropTypes.object,
  dispatch: React.PropTypes.func,
};

// Redux connection

export default connect()(PieChart);
