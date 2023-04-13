import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {ApolloClient, InMemoryCache, ApolloProvider, createHttpLink, from, split} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";
import { WebSocketLink } from "@apollo/client/link/ws";
import { SubscriptionClient } from "subscriptions-transport-ws";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SigninUser from "./SigninUser";
import SignupUser from "./SignupUser";
import OauthUser from "./OauthUser";
import Authorized from "./Authorized";
import Post from "./Post";
import {MantineProvider} from "@mantine/core";
import {getMainDefinition} from "@apollo/client/utilities";
import {GraphQLWsLink} from "@apollo/client/link/subscriptions";
import {createClient} from "graphql-ws";
import {createUploadLink} from "apollo-upload-client";

const httpLink = createUploadLink({
  uri: "http://localhost:8080/graphql",
  headers: { "apollo-require-preflight": "true" }
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

const httpAuthLink = apolloAuthContext.concat(httpLink);

// サーバー側でgraphl-wsを使用している場合はWebSocketLinkの代わりにGraphQlWsLinkを使用する必要がある
// const wsLink = new WebSocketLink(
//   new SubscriptionClient("ws://localhost:4000/graphql", {
//     reconnect: true
//   })
// );
const wsLink = new GraphQLWsLink(
  createClient({
    url: "ws://localhost:8080/graphql",
  })
);

// websocketとhttpのリンクを分割するためにsplitを使用する
const splitLink = split(
  // split は、クエリがサブスクリプションかどうかを判断する関数を受け取ります。
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  // 関数の戻り値が真のとき（サブスクリプションの場合）操作に用いるリンク
  wsLink,
  // 関数の戻り値が偽のとき（サブスクリプションでない場合）操作に用いるリンク
  httpAuthLink,
);

const client = new ApolloClient({
  link: splitLink,
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
  },
  {
    path: "/posts",
    element: <Post />,
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
