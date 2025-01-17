import * as dateUtils from '../parseDate';
/**
 * Transform multi-column CSV into data series
 * *REQUIRES* a numeric sequence along the X axis
 * Used for lineChart, etc
 *
 * @param {Object} data Parsed data input
 * @param {Array} fields List of fields/columns in order
 * @param {String} dateFormat
 * @return {(Object|Boolean)}Object of chart-ready data or false if data can't be used for this chart type
 */
export default function transformer(data, fields, dateFormat) {
  // e.g. "year"
  // we'll use this later when we set up the axes
  const xAxisLabel = fields[0];

  function getDataPoint(row, field) {
    const xValue = (dateFormat.enabled && dateFormat.validated) ?
      dateUtils.parse(row[xAxisLabel], dateFormat.formatString) :
      parseFloat(row[xAxisLabel]);

    if (!xValue) {
      return false;
    }

    return {
      x: xValue,
      y: parseFloat(row[field]),
    };
  }

  function createDataSeries(field) {
    const series = {
      key: field,
      values: [],
    };
    data.forEach((row) =>
      series.values.push(getDataPoint(row, field, xAxisLabel))
    );

    if (-1 !== series.values.indexOf(false)) {
      return false;
    }
    return series;
  }

  // create array of keys and values for each field
  const dataSeries = fields.map((field) =>
    createDataSeries(field)
  );

  // first item in array is the x-axis column
  dataSeries.shift();

  // return false if any data series didn't validate
  // e.g. if the first column didn't contain numbers or parseable Date
  // which would prevent us from doing a chart with an x-axis
  if (-1 !== dataSeries.indexOf(false)) {
    return false;
  }

  return dataSeries;
}
