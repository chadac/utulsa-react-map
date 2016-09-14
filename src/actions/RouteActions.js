/**
 * From https://facebook.github.io/flux/docs/todo-list.html
 **/
var AppDispatcher = require('../dispatcher/AppDispatcher');
var RouteConstants = require('../constants/RouteConstants');

var RouteActions = {

  create: function(data) {
    AppDispatcher.handleViewAction({
      actionType: RouteConstants.ROUTE_CREATE,
      data: data
    });
  },

  destroy: function(id) {
    AppDispatcher.handleViewAction({
      actionType: RouteConstants.ROUTE_DESTROY,
      id: id
    });
  },
};

module.exports = RouteActions;
