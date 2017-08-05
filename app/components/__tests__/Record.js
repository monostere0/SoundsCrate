/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import Record from '../Record';

jest.mock('Animated', () => ({
  createAnimatedComponent(cls: any): any {
    return cls;
  },
  Value: () => ({
    interpolate() {},
    setValue() {},
  }),
}));
jest.mock('Image', () => 'Image');

describe('app/components/Record', () => {
  const tree = renderer.create(
    <Record
      onShow={() => {}}
      onHide={() => {}}
      canBeShown={true}
      cover={'https://some-record-url/cover.png'}
      isLast={false}
      listYPosition={4}
      maxYPosition={500}/>
  );
  it('should render', () => {
    expect(tree).toMatchSnapshot();
  });
});
