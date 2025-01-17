import compose from 'lodash/fp/flow';
import groupBy from 'lodash/fp/groupBy';
import map from 'lodash/fp/map';
import { parse as parseDate } from '../parseDate';

export default function transform(data, fields, dateFormat) {
  // groups,x,y or groups,x,y,z
  const isInvalidNumFields = -1 === [3, 4].indexOf(fields.length);
  if (isInvalidNumFields) {
    return false;
  }

  const [groupingLabel, xAxisLabel, yAxisLabel, sizeLabel] = fields;

  const createPoint = (row) => {
    const isDateAxis = dateFormat.enabled && dateFormat.validated;
    const xValue = isDateAxis ?
      parseDate(row[xAxisLabel]) :
      parseFloat(row[xAxisLabel]);

    return {
      x: xValue,
      y: parseFloat(row[yAxisLabel]),
      size: parseFloat(row[sizeLabel]),
    };
  };

  const createSeries = (dataGroup) => ({
    key: dataGroup[0][groupingLabel],
    values: dataGroup.map(createPoint),
  });

  const validateSeries = (series) => {
    const isInvalidPoint = ({ x, y }) =>
      undefined === x ||
      isNaN(x) ||
      undefined === y ||
      isNaN(y);
    const isInvalidSeries = (aSeries) => aSeries.values.find(isInvalidPoint);

    return series.find(isInvalidSeries) ? false : series;
  };

  const getSeries = compose(
    groupBy(groupingLabel),
    map(createSeries),
    validateSeries
  );

  return getSeries(data);
}

/**
 * Determine if points in scatter data have a size attribute
 * If they do, data represents a bubble chart.
 * If not, data is a regular scatter chart.
 *
 * @param {Array} data
 * @return {Bool}
 */
export function scatterDataHasSizes(data) {
  return Array.isArray(data) &&
   data.length &&
   data[0].values.length &&
   data[0].values[0].size &&
   !isNaN(data[0].values[0].size);
}
