/* @flow */
import React from 'react';
import renderer from 'react-test-renderer';
import Folder from '../Folder';

jest.mock('../LoadingIndicator', () => 'LoadingIndicator');
jest.mock('../Record', () => ({
  __esModule: true,
  default: 'Record',
  ANIMATION_DURATION: 1,
}));
jest.mock('ScrollView', () => 'ScrollView');

describe('app/components/Folder', () => {
  it('should render', () => {
    const tree = renderer.create(
      <Folder
        records={[ 'foo', 'bar' ]}
        totalPages={1}
        isLoading={false}
        onScrollEnd={() => {}}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render loading state if there are no records', () => {
    const tree = renderer.create(
      <Folder
        records={[]}
        totalPages={1}
        isLoading={false}
        onScrollEnd={() => {}}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render loading state if prop passed', () => {
    const tree = renderer.create(
      <Folder
        records={[ 'foo', 'bar' ]}
        totalPages={1}
        isLoading={true}
        onScrollEnd={() => {}}
      />
    );
    expect(tree).toMatchSnapshot();
  });
  it('should render only one loading state if prop passed and there are no records', () => {
    const tree = renderer.create(
      <Folder
        records={[]}
        totalPages={1}
        isLoading={true}
        onScrollEnd={() => {}}
      />
    );
    expect(tree).toMatchSnapshot();
  });
});
