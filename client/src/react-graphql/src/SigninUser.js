import React from 'react';
import {Title, Text, TextInput, Button, Loader, Container, Space} from "@mantine/core";
import { useMutation, gql } from "@apollo/client";

function SigninUser() {
  const [clientId, setClientId] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = React.useState([]);

  const SIGNIN_USER = gql`
    mutation SigninUser($clientId: String!) {
      signin(client_id: $clientId) {
        id,
        name,
        email,
        client_id
      }
    }
  `;

  const updateErrors = (error) => {
    setErrors((prevState) => {
      return [...prevState, error];
    })
  }

  const [signin, { data, loading_signin, error }] = useMutation(SIGNIN_USER, {variables: {
      "clientId": clientId
    }, onCompleted: (data) => {
      console.log(data);
      setLoading(false);
      localStorage.setItem("client_id", data.signin.client_id);
      window.location = `https://github.com/login/oauth/authorize?client_id=${data.signin.client_id}&scope=user`;
    }, onError: (e) => {
      setLoading(false);
      console.log(e);
      updateErrors(e.message);
    }
  });
  if (loading_signin) {
    setLoading(true)
  }
  // if (data) {
  //   console.log(data);
  //   setLoading(false);
  //   localStorage.setItem("client_id", data.client_id);
  //   window.location = `https://github.com/login/oauth/authorize?client_id=${data.client_id}&scope=user`;
  // }
  // if (error) {
  //   console.log(error);
  //   updateErrors(error);
  //   setLoading(false);
  // }

  return <>
    {(() => {
      if (loading) return <Loader />;
      if (errors.length > 0) return <Text>{errors}</Text>;
    })()}
    <Container>
      <Title order={1}>sign in</Title>
      <Space h="xl" />
      <Text>Sign in with registered user using by Github OAuth client id</Text>
      <Space h="sm" />
      <TextInput
        placeholder="Client id"
        label="Github OAuth client id"
        withAsterisk
        onChange={(event) => setClientId(event.currentTarget.value)}
      />
      <Space h="xl" />
      <Button loading={loading} onClick={() => signin()}>
        sign in
      </Button>
    </Container>
  </>;
}

export default SigninUser;
