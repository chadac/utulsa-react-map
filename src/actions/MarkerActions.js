/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var MarkerConstants = require('../constants/MarkerConstants');

var MarkerActions = {

  create: function(data) {
    AppDispatcher.handleViewAction({
      actionType: MarkerConstants.MARKER_CREATE,
      data: data
    });
  },

  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: MarkerConstants.MARKER_DESTROY,
      id: id
    });
  },
};

module.exports = MarkerActions;
