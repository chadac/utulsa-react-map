jest.mock('../../GMapsAPI');

describe('Marker', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Utilities = require('./Utilities');

  var Marker;
  var marker;

  beforeEach(function() {
    // Won't work without `.default`
    Marker = require('../Marker').default;
  });

  it('should render', () => {
    const marker = TestUtils.renderIntoDocument(
      <Marker {...Utilities.generateMarker(1)} />
    );
    expect(TestUtils.isCompositeComponent(marker)).toBeTruthy();
  });

  describe('$state', () => {
    it('should render InfoWindows', () => {
      const map = "Test Map 1";
      const marker = TestUtils.renderIntoDocument(
        <Marker {...Utilities.generateMarker(1)} $infoWindow={true} map={map} />
      );
      // Make sure the props are passed
      expect(marker.props.$infoWindow).toBeTruthy();
      // Make sure it rendered
      expect(marker.info.__isOpen).toBeTruthy();
      // Make sure it used the correct map
      expect(marker.info.getMap()).toBe(map);
    });
  });
});
