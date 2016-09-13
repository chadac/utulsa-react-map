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

  click: function(id) {
    AppDispatcher.handleViewAction({
      actionType: MarkerConstants.MARKER_CLICK,
      id: id
    });
  },

  mouseEnter: function(id) {
    AppDispatcher.handleViewAction({
      actionType: MarkerConstants.MARKER_MOUSE_ENTER,
      id: id
    });
  },

  mouseLeave: function(id) {
    AppDispatcher.handleViewAction({
      actionType: MarkerConstants.MARKER_MOUSE_LEAVE,
      id: id
    });
  }
};

module.exports = MarkerActions;
