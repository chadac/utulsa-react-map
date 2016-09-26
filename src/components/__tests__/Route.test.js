jest.mock('../../GMapsAPI');

describe('Route', () => {
  const React = require('react');
  const ReactDOM = require('react-dom');
  const TestUtils = require('react-addons-test-utils');
  const Utilities = require('./Utilities');

  var Route;

  beforeEach(function() {
    // Won't work without `.default`
    Route = require('../Route').default;
  });

  it('should render', () => {
    const route = TestUtils.renderIntoDocument(
      <Route {...Utilities.generateRoute(1)} />
    );
    expect(TestUtils.isCompositeComponent(route)).toBeTruthy();
  });
});
