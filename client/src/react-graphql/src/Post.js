import {useQuery, gql, useSubscription} from "@apollo/client";
import {Loader, Text, Paper, Table, Avatar, Title, Container, Stack, Space} from "@mantine/core";
import React from "react";

function Post() {
  const POST_QUERY = gql`
    query Post {
      posts {
        id
        title
        body
        userId
        author {
          email
          name
        }
      }
    }
  `;
  const POST_SUBSCRIBE = gql`
    subscription {
      newPost {
        mutation
        data {
          id
          title
          body
          userId
          author {
            email
            name
          }
        }
      }
    }
  `;

  // subscriptionのやり方その１
  useSubscription(POST_SUBSCRIBE, {
    onSubscriptionData: ({ client, subscriptionData }) => {
      console.log(subscriptionData);
      const newPost = subscriptionData.data.newPost;
      client.writeQuery({
        query: POST_QUERY,
        data: { posts: [newPost, ...data.posts] }
      });
    }
  });

  // subscriptionのやり方その２
  const { data, loading, error, subscribeToMore } = useQuery(POST_QUERY);
  // subscribeToMore({
  //   document: POST_SUBSCRIBE,
  //   updateQuery: (prev, { subscriptionData }) => {
  //     if (!subscriptionData.data) return prev;
  //     const newPost = subscriptionData.data.newPost;
  //     return Object.assign({}, prev, {
  //       posts: [newPost, ...prev.posts]
  //     });
  //   }
  // })
  if (loading) return <Loader />;
  if (error) {
    console.log(error);
    return <Text>{error.message}</Text>;
  }

  return (
    <>
      <Container>
        <Title order={1}>Post Page</Title>
        <Space h="xl" />
        <Title order={2}>Posts</Title>
        <Table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Author</th>
          </tr>
          </thead>
          <tbody>
          {data.posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>{post.author.name}</td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Post;
