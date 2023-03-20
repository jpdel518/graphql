import React from "react";
import { useMutation, gql } from "@apollo/client";
import {Button, Container, Loader, Space, Text, TextInput, Title} from "@mantine/core";

function SignupUser() {
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [clientId, setClientId] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  const SIGNUP_USER = gql`
    mutation SignupUser($name: String!, $email: String!, $clientId: String!, $clientSecret: String!) {
      signup(name: $name, email: $email, client_id: $clientId, client_secret: $clientSecret) {
        id,
        name,
        email,
        client_id
      }
    }
  `;

  // const updateErrors = (error) => {
  //   setErrors((prevState) => {
  //     return [...prevState, error];
  //   })
  // }

  const [signup, { data, loading_signup, error_signup }] = useMutation(SIGNUP_USER, {variables: {
      "name": name,
      "email": email,
      "clientId": clientId,
      "clientSecret": secret,
    }, onCompleted: (data) => {
      console.log(data);
      setLoading(false);
      localStorage.setItem("client_id", data.signup.client_id);
      window.location = `https://github.com/login/oauth/authorize?client_id=${data.signup.client_id}&scope=user`;
    }, onError: (e) => {
      setLoading(false);
      console.log(e);
      setError(e.message);
    }
  });
  if (loading_signup) {
    setLoading(true);
  }
  // if (data) {
  //   console.log(data);
  //   setLoading(false);
  //   localStorage.setItem("client_id", data.client_id);
  //   window.Location.href = `https://github.com/login/oauth/authorize?client_id=${data.client_id}&scope=user`;
  // }
  // if (error_signup) {
  //   console.log(error_signup);
  //   setError(error_signup.message);
  //   setLoading(false);
  // }

  return <>
    {(() => {
      if (loading) return <Loader />;
      if (error) return <Text>{error}</Text>;
    })()}
    <Container>
      <Title order={1}>sign up</Title>
      <Space h="xl" />
      <Text>Sign up with registered user using by Github OAuth client id and secret</Text>
      <Space h="sm" />
      <TextInput
        placeholder="Name"
        label="Name"
        withAsterisk
        onChange={(event) => setName(event.currentTarget.value)}
      />
      <Space h="sm" />
      <TextInput
        placeholder="Email"
        label="Email"
        withAsterisk
        onChange={(event) => setEmail(event.currentTarget.value)}
      />
      <Space h="sm" />
      <TextInput
        placeholder="Client id"
        label="Github OAuth client id"
        withAsterisk
        onChange={(event) => setClientId(event.currentTarget.value)}
      />
      <Space h="sm" />
      <TextInput
        placeholder="Client secret"
        label="Github OAuth client secret"
        withAsterisk
        onChange={(event) => setSecret(event.currentTarget.value)}
      />
      <Space h="xl" />
      <Button loading={loading} onClick={() => signup()}>
        sign up
      </Button>
    </Container>
  </>;
}

export default SignupUser;
