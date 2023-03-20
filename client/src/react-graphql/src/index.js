import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SigninUser from "./SigninUser";
import SignupUser from "./SignupUser";
import OauthUser from "./OauthUser";
import Authorized from "./Authorized";
import {MantineProvider} from "@mantine/core";

const httpLink = createHttpLink({
  uri: "http://localhost:8080",
});

const apolloAuthContext = setContext(async (_, {headers}) => {
  const token = localStorage.getItem('token')
  return {
    headers: {
      ...headers,
      Authorization: token ? `${token}` : ''
    },
  }
})

const client = new ApolloClient({
  link: apolloAuthContext.concat(httpLink),
  cache: new InMemoryCache()
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/signin",
    element: <SigninUser />,
  },
  {
    path: "/signup",
    element: <SignupUser />,
  },
  {
    path: "/oauth",
    element: <OauthUser />,
  },
  {
    path: "/authorized",
    element: <Authorized />,
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <MantineProvider withGlobalStyles withNormalizeCSStheme={{ colorScheme: 'dark'}}>
      <ApolloProvider client={client}>
        <RouterProvider router={router} />
      </ApolloProvider>
    </MantineProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
