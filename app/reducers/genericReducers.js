import update from 'react-addons-update';

/**
 * Reusable reducers for any parts of the store that don't need to do anything fancy
 * See http://redux.js.org/docs/basics/Reducers.html for explanation of basic reducers
 * This uses `initState` to and `allowActions` to dynamically set the reducer's initial state
 * and specify which actions it should be applied to
 */
export function baseReducer(initState, allowActions) {
  return (state, action) => {
    // If current action type is allowed, return currrent action data
    if (0 <= allowActions.indexOf(action.type)) {
      return action.data;
    }

    // Applies only when Redux is initializing the store
    if (undefined === state) {
      return initState;
    }

    // Ignore this action
    return state;
  };
}

export function mergeReducer(initState, allowActions) {
  return (state, action) => {
    // If current action type is allowed, return merged action data
    if (0 <= allowActions.indexOf(action.type)) {
      return update(state, { $merge: action.data });
    }

    // Applies only when Redux is initializing the store
    if (undefined === state) {
      return initState;
    }

    // Ignore this action
    return state;
  };
}