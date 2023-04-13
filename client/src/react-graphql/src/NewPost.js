import {Text, TextInput, Textarea, Image, Group, Space, useMantineTheme, Button} from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { Dropzone, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import React from "react";
import { gql, useMutation } from "@apollo/client";

function NewPost() {
  const NEW_POST = gql`
    mutation NewPost($title: String!, $body: String!, $file: Upload) {
      addPost(title: $title, body: $body, file: $file) {
        id
        title
        body
        user_id
        image_url
      }
    }
  `;

  const [title, setTitle] = React.useState("");
  const [body, setBody] = React.useState("");
  const [file, setFile] = React.useState(null);
  const [loading, setLoading] = React.useState(false);

  const theme = useMantineTheme();

  const [post, {}] = useMutation(NEW_POST, {variables: {
      "title": title,
      "body": body,
      "file": file,
    }, onCompleted: (data) => {
      console.log(data);
      setLoading(false);
    }, onError: (e) => {
      setLoading(false);
      console.log(e);
    }
  });

  return (
    <>
      <TextInput
        placeholder="Type post title here"
        label="Title"
        withAsterisk
        onChange={(e) => {setTitle(e.target.value)}}
      />
      <Space h="sm" />
      <Textarea
        placeholder="Type post body here"
        label="Body"
        withAsterisk
        onChange={(e) => {setBody(e.target.value)}}
      />
      <Space h="sm" />
      <Group spacing="sm" grow>
        {(() => {
          if (file) {
            const imageUrl = URL.createObjectURL(file);
            return (<Image
              src={imageUrl}
              maw={200}
              imageProps={{ onLoad: () => URL.revokeObjectURL(imageUrl) }}
            />);
          }
        })()}
        <Dropzone accept={IMAGE_MIME_TYPE} onDrop= {(files) =>{setFile(files[0])}}>
          <Group position="center" spacing="xs">
            <IconUpload
              size="1.5rem"
              stroke={1.5}
              color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
            />
            <Text align="center">Drop images here</Text>
          </Group>
        </Dropzone>
      </Group>
      <Space h="sm" />
      <Button loading={loading} onClick={() => {
        setLoading(true)
        return post()
      }}>
        Add Post
      </Button>
    </>
  );
}

export default NewPost;
