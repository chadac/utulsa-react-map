jest.mock('../../GMapsAPI');

describe('Map', () => {
  var React = require('react');
  var ReactDOM = require('react-dom');
  var TestUtils = require('react-addons-test-utils');
  var Utilities = require('./Utilities');

  var Map;
  var map;

  beforeEach(function() {
    // Won't work without `.default`
    Map = require('../Map').default;

    map = TestUtils.renderIntoDocument(
      <Map
        markers={Utilities.generateMarkers(10)}
        routes={Utilities.generateRoutes(10)}
      />
    );
  });

  it('should render', () => {
    expect(TestUtils.isCompositeComponent(map)).toBeTruthy();
  });
});
