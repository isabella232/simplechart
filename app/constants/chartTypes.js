/**
 * Chart types registry
 */
import * as pieChart from './chartTypeConfigs/pieChart';
import * as discreteBarChart from './chartTypeConfigs/discreteBarChart';
import * as lineChart from './chartTypeConfigs/lineChart';

export const selectableChartTypes = [pieChart, discreteBarChart, lineChart];

export const defaultBreakpoint = {
  noMaxWidth: true,
  maxWidth: 350,
  height: 400,
};

export const defaultBreakpointsOpt = {
  active: 0,
  values: [defaultBreakpoint],
};

export const nvd3Defaults = {
  nvd3SingleSeries: {
    x: (point) => point.label,
    y: (point) => point.value,
  },
  nvd3MultiSeries: {
    x: (point) => point.x,
    y: (point) => point.y,
  },
};