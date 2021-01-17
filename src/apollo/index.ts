import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import Vue from 'vue';
import VueApollo from 'vue-apollo';

import { ENDPOINTS } from '@/common/constants';

Vue.use(VueApollo);

export const createProvider = () => {
  const link = createHttpLink({
    uri: process.env.API_URL || `${ENDPOINTS.PASSPORT}/v1/graphql`,
    credentials: 'include'
  });

  const apolloClient = new ApolloClient({
    link,
    connectToDevTools: true,
    cache: new InMemoryCache(),
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'ignore'
      },
      query: {
        fetchPolicy: 'no-cache',
        errorPolicy: 'all'
      }
    }
  });

  return new VueApollo({
    defaultClient: apolloClient
  });
};
