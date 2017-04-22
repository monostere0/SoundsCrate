/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import LoadingIndicator from '../LoadingIndicator';

jest.mock('Animated', () => {
  class Value {
    interpolate(config) { return config; }
  }
  return {
    Value,
    Image: 'Image',
    spring(config) { return { start: () => {} } },
  };
});
jest.mock('Image', () => 'Image');
jest.mock('View', () => 'View');

describe('app/components/LoadingIndicator', () => {
  it('should render', () => {
    expect(renderer.create(<LoadingIndicator />)).toMatchSnapshot();
  });
});
