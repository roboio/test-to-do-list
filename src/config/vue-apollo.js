import {DefaultApolloClient} from '@vue/apollo-composable';
import {provideApolloClient} from '@vue/apollo-composable';
import {createSubscriptionHandshakeLink} from 'aws-appsync-subscription-link';
import {ApolloClient, InMemoryCache, createHttpLink, ApolloLink} from '@apollo/client/core';

const api_header = {
  host: process.env.VUE_APP_AWS_APP_ASYNC_HOST,
  'x-api-key': process.env.VUE_APP_AWS_APP_ASYNC_API_KEY
};

const httpLink = createHttpLink({
  uri: process.env.VUE_APP_AWS_APP_ASYNC_ENDPOINT,
  headers: api_header
});

const region = 'us-east-1';
const auth = {
  type: 'API_KEY', // or 'AWS_IAM', 'AMAZON_COGNITO_USER_POOLS', etc.
  apiKey: process.env.VUE_APP_AWS_APP_ASYNC_API_KEY,
};
const link = ApolloLink.from([createSubscriptionHandshakeLink({
  url: process.env.VUE_APP_AWS_APP_ASYNC_ENDPOINT,
  region,
  auth
}, httpLink),]);

export const apolloClient = new ApolloClient({
  link, cache: new InMemoryCache(),
});

export function setupApollo(app) {
  provideApolloClient(apolloClient);
  app.provide(DefaultApolloClient, apolloClient);
}
