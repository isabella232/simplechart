/**
 * RECEIVE_CHART_OPTIONS middleware
 */

import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_EXTEND,
  RECEIVE_DEFAULTS_APPLIED_TO,
} from '../constants';
import actionTrigger from '../actions';
import defaultPalette from '../constants/defaultPalette';
import { defaultBreakpointsOpt } from '../constants/chartTypes';
import update from 'react-addons-update';
import dispatchChartData from './utils/dispatchChartData';
import applyChartTypeDefaults from './utils/applyChartTypeDefaults';
import applyYDomain from './utils/applyYDomain';
import applyDataFormatters from './utils/applyDataFormatters';

export default function receiveChartType({ getState }) {
  return (dispatch) => (action) => {
    if (RECEIVE_CHART_OPTIONS !== action.type &&
      RECEIVE_CHART_OPTIONS_EXTEND !== action.type
    ) {
      return dispatch(action);
    }

    /**
     * Setup local vars and functions
     */
    // Clone received options
    let nextOpts = update({}, { $set: action.data });

    /**
     * Determine from store if we need to apply colors to data series.
     * True when dataFormat is nvd3MultiSeries and
     * action comes from manual user change OR not all series have a color already
     */
    function _shouldApplyColorsToData() {
      let shouldApply;
      try {
        if ('nvd3MultiSeries' !== getState().chartType.config.dataFormat) {
          // Don't apply if data format isn't NVD3 multi series
          shouldApply = false;
        } else if ('PalettePicker' === action.src) {
          // Apply if update came from manual user change
          shouldApply = true;
        } else {
          // Test if at least one series doesn't have a color already
          shouldApply = getState().chartData.reduce((acc, series) =>
            (acc || !series.hasOwnProperty('color'))
          , false);
        }
      } catch (err) {
        shouldApply = false;
      }
      return shouldApply;
    }

    /**
     * Was this dispatch triggered by bootstrap.new or bootstrap.edit?
     */
    function _actionIsBootstrap() {
      return 0 === action.src.indexOf('bootstrap');
    }

    /**
     * Apply default palette if we haven't already received colors and we're not receiving them now
     * @todo Handle non-NVD3 types
     */
    function _shouldApplyDefaultPalette() {
      return !_actionIsBootstrap() &&
        (!nextOpts.color || !nextOpts.color.length) &&
        (!getState().chartOptions.color || !getState().chartOptions.color.length); // eslint-disable-line max-len
    }

    /**
     * Return true if we are not bootstrapping from postMessage and
     * default options not already applied for this chart type
     */
    function _shouldApplyChartTypeDefaults() {
      const configType = getState().chartType.config ?
        getState().chartType.config.type : null;

      return !_actionIsBootstrap() &&
        configType && configType !== getState().defaultsAppliedTo;
    }

    /**
     * Update data formatting function after manual change
     */
    function _shouldApplyDataFormatters() {
      return getState().chartType.config && // must have chart type config in store
        nextOpts.tickFormatSettings && // must have settings to use
        !_actionIsBootstrap(); // bootstrapStore handles this for initial load
    }

    /**
     * set yDomain if needed
     */
    function _shouldApplyYDomain() {
      return !nextOpts.yDomain && // current action is not setting yDomain
        0 < getState().chartData.length && // we have data to analyze
        getState().chartType.config; // we have a chart type to apply domain to
    }

    function _shouldSetBreakpoints() {
      return !nextOpts.breakpoints && !getState().chartOptions.breakpoints;
    }

    /**
     * Return the object we should merge into the default breakpoints object,
     * setting default height to stored height if needed
     */
    function _setupBreakpointsOpt() {
      const defaultHeight = nextOpts.height || getState().chartOptions.height;
      if (undefined === defaultHeight) {
        return defaultBreakpointsOpt;
      }
      return update(defaultBreakpointsOpt,
        { values: { 0: { height: { $set: defaultHeight } } } });
    }

    /**
     * Handle received chart options
     */

    // Set up colors if needed. This will apply when a new chart does not receive a custom color palette
    if (_shouldApplyDefaultPalette()) {
      nextOpts = update(nextOpts, { color: { $set: defaultPalette } });
    }

    // Apply colors to chartData if needed and dispatch to store
    if (nextOpts.hasOwnProperty('color') && _shouldApplyColorsToData()) {
      dispatchChartData(
        dispatch,
        getState().chartType.config,
        getState().transformedData,
        nextOpts.color,
        action.src
      );
    }

    // Apply default options
    if (_shouldApplyChartTypeDefaults()) {
      nextOpts = applyChartTypeDefaults(
        getState().chartType.config,
        nextOpts,
        getState().defaultsAppliedTo
      );
      dispatch(actionTrigger(
        RECEIVE_DEFAULTS_APPLIED_TO,
        getState().chartType.config.type,
        action.src
      ));
    }

    if (_shouldApplyDataFormatters()) {
      // applyDataFormatters returns a cloned object
      nextOpts = applyDataFormatters(nextOpts, getState().chartType.config);
    }

    if (_shouldApplyYDomain()) {
      nextOpts = applyYDomain(
        nextOpts,
        getState().chartType.config,
        getState().chartData
      );
    }

    /**
     * Set default breakpoints object
     */
    if (_shouldSetBreakpoints()) {
      nextOpts = update(nextOpts, { breakpoints: {
        $set: _setupBreakpointsOpt(),
      } });
    }

    // Send nextOpts to Redux store
    return dispatch(actionTrigger(action.type, nextOpts, action.src));
  };
}