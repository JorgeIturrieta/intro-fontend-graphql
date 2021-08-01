import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// ******* Definicion cliente apollo
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider,split } from '@apollo/client'
import { setContext } from 'apollo-link-context'

// ******* Definicion  para utilizar subscripciones
import { WebSocketLink } from '@apollo/client/link/ws';
import { getMainDefinition } from '@apollo/client/utilities'


const authLink = setContext((_, { headers }) => {
const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? token : "",
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000/' })

// Configuracion subscripciones 

const wsLink = new WebSocketLink({
  uri: `ws://localhost:4000/`,
  options: {
    reconnect: true
  }
})
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  authLink.concat(httpLink),
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:  splitLink
})

// ******* fin Definicion cliente apollo
ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
