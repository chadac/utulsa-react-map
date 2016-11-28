/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var AppStateConstants = require('../constants/AppStateConstants');

var AppStateActions = {
  openIndex: () => {
    AppDispatcher.dispatch({
      actionType: AppStateConstants.OPEN_INDEX_MODAL,
    });
  },

  closeModal: () => {
    AppDispatcher.dispatch({
      actionType: AppStateConstants.CLOSE_MODAL,
    });
  },
};

module.exports = AppStateActions;
