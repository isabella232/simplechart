import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { RECEIVE_CHART_METADATA } from '../../../constants';
import DispatchField from '../../lib/DispatchField';
import HelpTrigger from '../../lib/HelpTrigger';
import * as styles from './ChartTitle.css';

class ChartTitle extends Component {
  static propTypes = {
    metadata: PropTypes.object.isRequired,
  };

  componentWillMount() {
    this.setState({ title: this.props.metadata.title || '' });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ title: nextProps.metadata.title || '' });
  }

  handleInput = (fieldProps, value) => {
    let subtitle = '';
    if ('undefined' !== typeof this.props.metadata.subtitle &&
      ('' === this.props.metadata.subtitle || this.props.metadata.subtitle)) {
      subtitle = this.props.metadata.subtitle;
    } else {
      subtitle = false;
    }
    return ({
      title: value,
      notes: this.props.metadata.notes || '',
      source: this.props.metadata.source || '',
      subtitle,
    });
  };

  render() {
    return (
      <div className={styles.container}>
        <DispatchField
          action={RECEIVE_CHART_METADATA}
          fieldType="Input"
          fieldProps={{
            label: 'Chart title',
            name: 'metadata-title',
            value: this.state.title,
            style: { marginBottom: '0px' }, // override default Rebass style
          }}
          handler={this.handleInput}
        />
        <HelpTrigger docName="chartMetadata" />
      </div>
    );
  }
}

export default connect()(ChartTitle);
