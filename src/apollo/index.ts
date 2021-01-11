import Vue from 'vue';
import VueApollo from 'vue-apollo';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

Vue.use(VueApollo);

export const createProvider = () => {
  const link = createHttpLink({
    uri: process.env.API_URL || 'https://localhost:3000/v1/graphql'
  });

  const apolloClient = new ApolloClient({ link, cache: new InMemoryCache() });

  return new VueApollo({
    defaultClient: apolloClient
  });
};
