/* *
 * From https://facebook.github.io/flux/docs/todo-list.html
 * 
 * var Promise = require('es6-promise').Promise;
 * var assign = require('object-assign');
 * 
 * var _callbacks = [];
 * var _promises = [];
 * 
 * var Dispatcher = function() {};
 * Dispatcher.prototype = assign({}, Dispatcher.prototype, {
 * 
 *   /**
 *    * Register a Store's callback so that it may be invoked by an action.
 *    * @param {function} callback The callback to be registered.
 *    * @return {number} The index of the callback within the _callbacks array.
 *    */
*   register: function(callback) {
  *     _callbacks.push(callback);
  *     return _callbacks.length - 1; // index
  *   },
* 
*   /**
*    * dispatch
*    * @param  {object} payload The data from the action.
*    */
*   dispatch: function(payload) {
*     // First create array of promises for callbacks to reference.
*     var resolves = [];
*     var rejects = [];
*     _promises = _callbacks.map(function(_, i) {
*       return new Promise(function(resolve, reject) {
*         resolves[i] = resolve;
*         rejects[i] = reject;
*       });
*     });
*     // Dispatch to callbacks and resolve/reject promises.
*     _callbacks.forEach(function(callback, i) {
*       // Callback can return an obj, to resolve, or a promise, to chain.
*       // See waitFor() for why this might be useful.
*       Promise.resolve(callback(payload)).then(function() {
*         resolves[i](payload);
*       }, function() {
*         rejects[i](new Error('Dispatcher callback unsuccessful'));
*       });
*     });
*     _promises = [];
*   },
* 
*   /**
*    * @param  {array} promiseIndexes
*    * @param  {function} callback
*    */
*   waitFor: function(promiseIndexes, callback) {
*     var selectedPromises = promiseIndexes.map(
*       function(index) {
*         return _promises[index];
*       });
*     return Promise.all(selectedPromises).then(callback);
*   }
* });
* 
* module.exports = Dispatcher;*/
