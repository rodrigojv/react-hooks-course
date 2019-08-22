import React from 'react'
import ReactDOM from 'react-dom'
import {ApolloProvider} from "@apollo/react-hooks";
import {ApolloClient} from "apollo-client";
import {ApolloLink} from "apollo-link";
import { HttpLink } from 'apollo-link-http';
import {onError} from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

import './index.css'
import { ThemeProvider } from './contexts/theme'
import AuthContext from "./contexts/auth";
import Nav from './components/Nav'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Loading from './components/Loading'
import ProtectedRoute from "./components/ProtectedRoute";

const Popular = React.lazy(() => import('./components/Popular'))
const Battle = React.lazy(() => import('./components/Battle'))
const Results = React.lazy(() => import('./components/Results'))
const Login = React.lazy(() => import('./components/Login'))



const GITHUB_BASE_URL = 'https://api.github.com/graphql';

function getClient() {
  const httpLink = new HttpLink({
    uri: GITHUB_BASE_URL,
    headers: {
      authorization: `Bearer ${window.localStorage.getItem('token')}`
    }
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors) {
      graphQLErrors.map(({ message, locations, path }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
        ),
      );
    }
  
    if (networkError) {
      console.log(`[Network error]: ${networkError}`);
    }
  });

  const link = ApolloLink.from([errorLink, httpLink]);

  const cache = new InMemoryCache();

  return new ApolloClient({
    link,
    cache
  });
}

const client = getClient();

function App() {
  const [theme, setTheme] = React.useState('light');
  const [token, setToken] = React.useState(() => window.localStorage.getItem("token"))
  const toggleTheme = () => {
    setTheme((theme) => theme === 'light' ? 'dark' : 'light');
  }

  const updateToken = (token) => {
    window.localStorage.setItem("token", token);
    setToken(token);  
  }

  return (
    <Router>
      <ThemeProvider value={theme}>
        <AuthContext.Provider value={token} >
          <ApolloProvider client={client}>
            <div className={theme}>
              <div className='container'>
                <Nav toggleTheme={toggleTheme}/>

                <React.Suspense fallback={<Loading />} >
                  <Switch>
                    <ProtectedRoute exact path='/' component={Popular} />
                    <ProtectedRoute exact path='/battle' component={Battle} />
                    <ProtectedRoute path='/battle/results' component={Results} />
                    <Route exact path='/login' render={() => <Login updateToken={updateToken} />} />
                    <Route render={() => <h1>404</h1>} />
                  </Switch>
                </React.Suspense>
              </div>
            </div>
          </ApolloProvider>
        </AuthContext.Provider>
      </ThemeProvider>
    </Router>
  )
      
}

ReactDOM.render(
  <App />,
  document.getElementById('app')
)