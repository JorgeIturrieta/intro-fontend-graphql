import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
// ******* Definicion cliente apollo
import { ApolloClient, HttpLink, InMemoryCache, ApolloProvider } from '@apollo/client'
import { setContext } from 'apollo-link-context'

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('phonenumbers-user-token')
  return {
    headers: {
      ...headers,
      authorization: token ? `bearer ${token}` : null,
    }
  }
})

const httpLink = new HttpLink({ uri: 'http://localhost:4000' })

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link:  authLink.concat(httpLink)
})

// ******* fin Definicion cliente apollo
ReactDOM.render(
  <ApolloProvider client={client} >
    <App />
  </ApolloProvider>,
  document.getElementById('root')
)
