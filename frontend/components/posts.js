import { Box, Button, Flex, Image, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { EditPost } from './editPost';
import { DeletePost } from './deletePost';
import { io } from 'socket.io-client';
import { useRouter } from 'next/router';
import { useQueryClient } from '@tanstack/react-query';

export const Posts = ({ post, token, userId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const socket = io('http://localhost:8080');

  socket.on('posts', (data) => {
    if (data.action === 'create') {
      queryClient.refetchQueries();
    } else if (data.action === 'update') {
      queryClient.refetchQueries();
    } else if (data.action === 'delete') {
      queryClient.refetchQueries();
    }
  });

  return (
    <Box w="xl">
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
          mb={3}
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

          <Flex justifyContent="space-between" alignItems="flex-start" w="full">
            <Flex gap={2}>
              <Box>
                <Text fontWeight="bold" fontSize="xl">
                  {post.creator.name}
                </Text>
                <Text alignItems="center" color="gray">
                  @{post.creator.userName}
                </Text>
              </Box>
              <Box fontSize="xl" color="gray">
                <Text>
                  · {new Date(post.createdAt).toLocaleDateString('en-GB')}
                </Text>
              </Box>
            </Flex>
            {post.creator._id === userId && (
              <Flex alignItems="flex-start" gap={2}>
                <EditPost postId={post._id} token={token} />
                <DeletePost postId={post._id} token={token} />
              </Flex>
            )}
          </Flex>
        </Flex>
        <Link href={'/post/' + post._id}>
          <Text mb={6} w="full" textAlign="start" fontSize="xl">
            {post.content}
          </Text>
          <Image
            w="3xl"
            src={`http://localhost:8080/${post.imageUrl}`}
            alt={post.creator.name}
          />
        </Link>
      </Flex>
    </Box>
  );
};
