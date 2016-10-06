/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppStateConstants = require('../constants/AppStateConstants');

var AppStateActions = {
  openFilterBy: () => {
    AppDispatcher.handleViewAction({
      actionType: AppStateConstants.FILTER_BY_OPEN,
    });
  },

  closeFilterBy: () => {
    AppDispatcher.handleViewAction({
      actionType: AppStateConstants.FILTER_BY_CLOSE,
    });
  },
};

module.exports = AppStateActions;
