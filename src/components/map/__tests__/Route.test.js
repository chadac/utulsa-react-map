jest.mock('../../../GMapsAPI');

describe('Route', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Utilities = require('./Utilities');

  var Route;
  var map;
  var openInfoWindow;
  var closeInfoWindow;
  var mocks;

  beforeEach(function() {
    // Won't work without `.default`
    Route = require('../Route').default;
    map = new Object();
    openInfoWindow = jest.fn();
    closeInfoWindow = jest.fn();
    mocks = {
      map: map,
      _openInfoWindow: openInfoWindow,
      _closeInfoWindow: closeInfoWindow,
    }
  });

  it('should render', () => {
    const route = TestUtils.renderIntoDocument(
      <Route {...Utilities.generateRoute(1)} {...mocks} />
    );
    expect(TestUtils.isCompositeComponent(route)).toBeTruthy();
  });
});
