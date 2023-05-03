import { Box, Flex, Image, Text } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { Navigate } from '../../../components/navigate';

const Post = ({ post }) => {
  useEffect(() => {
    const token = Cookies.get('jwt');
    if (!token) {
      router.push('/login');
    }
  }, []);

  return (
    <>
      <Navigate />
      <Flex justifyContent="center" alignItems="flex-start">
        <Flex
          w="md"
          alignItems="center"
          flexDirection="column"
          borderRight={{ md: '1px' }}
          borderLeft={{ md: '1px' }}
          borderBottom={{ md: '1px' }}
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
              objectFit="cover"
              w="50px"
              h="50px"
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

          <Text w="full" textAlign="start" fontSize="xl">
            {post.content}
          </Text>
          {post.imageUrl && (
            <Image
              mt={6}
              w={550}
              borderRadius="10px"
              src={`${process.env.SERVER_URL}/${post.imageUrl}`}
              alt={post.creator.name}
            />
          )}
        </Flex>
      </Flex>
    </>
  );
};

export default Post;

export async function getServerSideProps({ params, req }) {
  const { postId } = params;
  const token = req.cookies.jwt;
  const data = await fetch(
    process.env.SERVER_URL + '/api/v1/home/post/' + postId,
    {
      headers: {
        Authorization: token,
      },
    }
  );
  const { post } = await data.json();
  return {
    props: {
      post,
    },
  };
}
