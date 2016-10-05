jest.mock('../../../GMapsAPI');

describe('InfoWindow', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Utilities = require('./Utilities');
  const gmaps = require('../../../GMapsAPI');

  var InfoWindow;

  var map;
  var position;
  var _closeInfoWindow;
  var mocks;

  beforeEach(() => {
    InfoWindow = require('../InfoWindow');

    map = new gmaps.Map();
    position = new gmaps.LatLng();
    _closeInfoWindow = jest.fn();
    mocks = {
      $infoWindow: false,
      map: map,
      position: position,
      _closeInfoWindow: _closeInfoWindow
    };
  });

  it('should render', () => {
    const infoWindow = TestUtils.renderIntoDocument(
      <InfoWindow {...mocks} />
    );
    expect(TestUtils.isCompositeComponent(infoWindow)).toBeTruthy();
  });
});
