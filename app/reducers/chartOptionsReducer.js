import {
  RECEIVE_CHART_OPTIONS,
  RECEIVE_CHART_OPTIONS_INIT,
  RECEIVE_CHART_OPTIONS_EXTEND,
  DELETE_CHART_OPTIONS,
} from '../constants';
import update from 'react-addons-update';
import deepExtend from 'deep-extend';

export default function chartOptionsReducer(state = {}, action) {
  // Loop through array of keys passed via DELETE_CHART_OPTIONS
  // and delete from state if defined
  function _deleteKeys(applyState) {
    if (!action.data || !action.data.length) {
      return applyState;
    }
    action.data.forEach((key) => {
      if ('undefined' !== typeof applyState[key]) {
        delete applyState[key]; // eslint-disable-line no-param-reassign
      }
    });
    return applyState;
  }

  function _extendState(applyState) {
    deepExtend(applyState, action.data);
    return applyState;
  }

  switch (action.type) {
    case RECEIVE_CHART_OPTIONS_INIT:
    case RECEIVE_CHART_OPTIONS: {
      return update(state, { $merge: action.data });
    }

    case RECEIVE_CHART_OPTIONS_EXTEND:
      return update(state, { $apply: _extendState });

    case DELETE_CHART_OPTIONS: {
      return update(state, { $apply: _deleteKeys });
    }

    default:
      return state;
  }
}
