import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

const Post = ({ post }) => {
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <Flex justifyContent="center" alignItems="flex-start">
      <Flex
        alignItems="center"
        flexDirection="column"
        borderRight="1px"
        borderLeft="1px"
        borderBottom="1px"
        p={12}
        borderColor="gray"
      >
        <Flex
          w="full"
          mb={6}
          gap={2}
          justifyContent="flex-start"
          alignItems="center"
        >
          <Image
            borderRadius="full"
            w="70px"
            h="70px"
            objectFit="cover"
            src={`http://localhost:8080/${post.creator.imageUrl}`}
            alt={post.creator.name}
          />
          <Box>
            <Text fontWeight="bold" fontSize="xl">
              {post.creator.name}
            </Text>
            <Text color="gray">@{post.creator.userName}</Text>
          </Box>
        </Flex>

        <Text mb={6} w="full" textAlign="start" fontSize="xl">
          {post.content}
        </Text>
        <Image
          w={550}
          src={`http://localhost:8080/${post.imageUrl}`}
          alt={post.creator.name}
        />
      </Flex>
    </Flex>
  );
};

export default Post;

export async function getServerSideProps({ params, req }) {
  const { postId } = params;
  const token = req.cookies.jwt;
  const data = await fetch('http://localhost:8080/api/v1/home/post/' + postId, {
    headers: {
      Authorization: token,
    },
  });
  const { post } = await data.json();
  return {
    props: {
      post,
    },
  };
}
