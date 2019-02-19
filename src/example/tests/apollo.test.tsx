import * as React from 'react';
import * as renderer from 'react-test-renderer';

import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import { load, wait, renderApollo } from '../../proxies/loader';

describe('Component', () => {
  describe('With Apollo', function() {
    const Component: React.FC = () => {
      return (
        <Query
          query={gql`
            query People {
              people
            }
          `}
        >
          {props => {
            if (props.loading) {
              return <div>Loading ...</div>;
            }
            if (props.error) {
              return <pre>{JSON.stringify(props.error, null, 2)}</pre>;
            }
            return (
              <ul>
                <li>Fail</li>
                {props.data.people.map((p: string, i: number) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            );
          }}
        </Query>
      );
    };

    const config = {
      component: Component,
      apollo: {
        // mocked response for the query named PostsForAuthor
        People: {
          resolveWith: {
            people: ['Tomas', 'Valeria']
          }
        }
      }
    };

    it('renders', async function() {
      const render = renderer.create(load(config));
      expect(render).toMatchSnapshot('Loading');

      await wait();

      expect(render).toMatchSnapshot('Rendered');
    });

    it('renders async', async function() {
      const render = await renderApollo(config);
      expect(render).toMatchSnapshot('Rendered');
    });

    return config;
  });
});
