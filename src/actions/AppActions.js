/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppState = require('../constants/AppState');
var AppConstants = require('../constants/AppConstants');

var AppActions = {
  setState: (state) => {
    AppDispatcher.dispatch({
      actionType: AppConstants.APP_SET_STATE,
      state: state
    });
  },

  reset: () => {
    AppDispatcher.dispatch({
      actionType: AppConstants.APP_SET_STATE,
      state: AppState.NORMAL,
    });
  }
};

module.exports = AppActions;
