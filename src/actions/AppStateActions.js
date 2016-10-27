/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppStateConstants = require('../constants/AppStateConstants');

var AppStateActions = {
  openIndex: () => {
    AppDispatcher.handleViewAction({
      actionType: AppStateConstants.OPEN_INDEX_MODAL,
    });
  },

  closeModal: () => {
    AppDispatcher.handleViewAction({
      actionType: AppStateConstants.CLOSE_MODAL,
    });
  },
};

module.exports = AppStateActions;
