jest.mock('../../../GMapsAPI');

describe('Marker', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Utilities = require('./Utilities');

  var Marker;

  var map;
  var openInfoWindow;
  var closeInfoWindow;
  var mocks;

  beforeEach(function() {
    // Won't work without `.default`
    Marker = require('../Marker').default;
    map = new Object();
    openInfoWindow = jest.fn();
    closeInfoWindow = jest.fn();
    mocks = {
      $infoWindow: false,
      map: map,
      _openInfoWindow: openInfoWindow,
      _closeInfoWindow:closeInfoWindow
    };
  });

  it('should render', () => {
    const marker = TestUtils.renderIntoDocument(
      <Marker {...Utilities.generateMarker(1)} {...mocks} />
    );
    expect(TestUtils.isCompositeComponent(marker)).toBeTruthy();
  });
});
