/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 * @module AppActions
 **/
import AppDispatcher from '../dispatcher/AppDispatcher';
import AppState from '../constants/AppState';
import AppConstants from '../constants/AppConstants';

/**
 * Actions that can change the app information.
 */
var AppActions = {
  /**
   * Sets the state of the app. Possible states are available in
   * [[src/constants/AppState.js]].
   * @param {string} state The new app state.
   */
  setState: (state) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.APP_SET_STATE,
      state: state
    });
  },

  /**
   * Resets the app state to `AppState.NORMAL`.
   */
  reset: () => {
    AppDispatcher.dispatch({
      actionType: AppConstants.APP_SET_STATE,
      state: AppState.NORMAL,
    });
  }
};

export default AppActions;
