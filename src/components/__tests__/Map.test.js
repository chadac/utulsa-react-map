import React from 'react';
import renderer from 'react-test-renderer';
import Map from '../Map';

describe('Map', () => {
  const component = renderer.create(
    <Map />
  );
});
