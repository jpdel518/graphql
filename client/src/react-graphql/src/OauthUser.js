import React from "react";
import { useMutation, gql } from "@apollo/client";
import {Container, Loader, Space, Text, Title} from "@mantine/core";

function OauthUser() {
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const OAUTH_USER = gql`
    mutation OAuthUser($clientId: String!, $clientCode: String!) {
      oauth(client_id: $clientId, client_code: $clientCode)
    }
  `;

  const updateErrors = (error) => {
    setErrors((prevState) => {
      return [...prevState, error];
    })
  }

  const [oauth, { data, loading_oauth, error_oauth }] = useMutation(OAUTH_USER, {variables: {
      "clientId": localStorage.getItem("client_id"),
      "clientCode": window.location.href.split("?code=")[1],
    }, onCompleted: (data) => {
      console.log("client_id: ", localStorage.getItem("client_id"));
      console.log(data);
      setLoading(false);
      window.localStorage.setItem("token", data.oauth);
      window.location = "http://localhost:3000/authorized";
    }, onError: (e) => {
      setLoading(false);
      console.log(e);
      updateErrors(e.message);
    }
  });

  if (loading_oauth) {
    setLoading(true)
  }
  // if (data) {
  //   console.log(data);
  //   setLoading(false);
  //   // window.Location.href = ``;
  // }
  // if (error) {
  //   console.log(error);
  //   updateErrors(error);
  //   setLoading(false);
  // }

  React.useEffect(() => {
    if (window.location.href.indexOf("?code=") > 0) {
      console.log("code found in url");
      console.log("code", window.location.href.split("?code=")[1]);
      oauth();
    } else {
      updateErrors("No code found in url");
    }
  }, []);

  return <>
    {(() => {
      if (loading) return <Loader />;
      if (errors.length > 0) {
        return errors.map(error => {
          return <Text>{error}</Text>;
        });
      }
    })()}
    <Container>
      <Title order={1}>oauth</Title>
      <Space h="xl" />
      <Text>oauth to github</Text>
    </Container>
  </>;
}

export default OauthUser;
