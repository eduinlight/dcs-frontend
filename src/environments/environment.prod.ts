import sharedEnvironment from './base';

export const environment = {
  ...sharedEnvironment,
  apiUrl: sharedEnvironment['apiUrl'] || 'https://api.binary-coffee.dev/',
  graphqlUrl: sharedEnvironment['graphqlUrl'] || 'https://api.binary-coffee.dev/graphql',
  siteUrl: sharedEnvironment['siteUrl'] || 'https://binary-coffee.dev',
  production: sharedEnvironment['production'] || false
};
