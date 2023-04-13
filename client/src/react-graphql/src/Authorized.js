import { useQuery, gql } from "@apollo/client";
import {Loader, Text, Paper, Table, Avatar, Title, Container, Stack, Space, Flex, NavLink, Button} from "@mantine/core";
import {IconActivity, IconChevronRight} from "@tabler/icons-react";
import {Link} from "react-router-dom";

function Authorized() {
  const AUTHORIZED_QUERY = gql`
    query Authorized {
      jsonPlaceUsers {
        id
        name
        email
      }
      me {
        id
        name
        email
        client_id
        client_secret
      }
    }
  `;
  const { data, loading, error } = useQuery(AUTHORIZED_QUERY);
  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <Container>
        <Title order={1}>Authorized Page</Title>
        <Space h="xl" />
        <Paper shadow="sm" p="md">
          <Title order={2}>My Profile</Title>
          <Flex justify="center"
                align="center"
                direction="row"
                gap="md"
          >
            <div>
              <Avatar radius="xl" />
              <Text>ID: {data.me.id}</Text>
              <Text>Name: {data.me.name}</Text>
              <Text>Email: {data.me.email}</Text>
              <Text>ClientID: {data.me.client_id}</Text>
              <Text>ClientSecret: {data.me.client_secret}</Text>
            </div>
            <Button
              component="a"
              href="http://localhost:3000/posts"
            >
              Show Posts
            </Button>
          </Flex>
        </Paper>
        <Space h="xl" />
        <Title order={2}>JsonPlace Users</Title>
        <Table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
          </tr>
          </thead>
          <tbody>
          {data.jsonPlaceUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Authorized;
