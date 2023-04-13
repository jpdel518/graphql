import {useQuery, gql, useSubscription} from "@apollo/client";
import {Loader, Text, Table, Title, Container, Space, Image} from "@mantine/core";
import React from "react";
import NewPost from "./NewPost";

function Post() {
  const POST_QUERY = gql`
    query Post {
      posts {
        id
        title
        body
        user_id
        image_url
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
          user_id
          image_url
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
        <NewPost />
        <Space h="xl" />
        <Title order={2}>Posts</Title>
        <Table>
          <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Body</th>
            <th>Author</th>
            <th>Image</th>
          </tr>
          </thead>
          <tbody>
          {data.posts.map((post) => (
            <tr key={post.id}>
              <td>{post.id}</td>
              <td>{post.title}</td>
              <td>{post.body}</td>
              <td>{post.author.name}</td>
              <td><Image maw={100} src={post.image_url} /></td>
            </tr>
          ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Post;
