import { Box, Button, Flex, Image, LinkBox, Text } from '@chakra-ui/react';
import Link from 'next/link';
import { EditPost } from './editPost';
import { DeletePost } from './deletePost';

export const Posts = ({ post, token, userId }) => {
  return (
    <Box w={{ base: 'full', md: 'xl' }}>
      <Flex
        alignItems="center"
        flexDirection="column"
        borderRight={{ md: '1px' }}
        borderLeft={{ md: '1px' }}
        borderBottom="1px"
        borderColor="gray"
        p={8}
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
            w="50px"
            h="50px"
            objectFit="cover"
            src={process.env.CLIENT_URI + '/' + post.creator.imageUrl}
            alt={post.creator.name}
          />

          <Flex justifyContent="space-between" alignItems="flex-start" w="full">
            <Box>
              <Flex gap={2}>
                <Text fontWeight="bold" fontSize={{ md: 'xl' }}>
                  {post.creator.name}
                </Text>
                <Box
                  fontSize="xl"
                  color="gray"
                  display={{ base: 'none', md: 'block' }}
                >
                  <Text>
                    · {new Date(post.createdAt).toLocaleDateString('en-GB')}
                  </Text>
                </Box>
              </Flex>

              <Text alignItems="center" color="gray">
                @{post.creator.userName}
              </Text>
            </Box>
            {post.creator._id === userId && (
              <Flex alignItems="flex-start" gap={2}>
                <EditPost post={post} postId={post._id} token={token} />
                <DeletePost postId={post._id} token={token} />
              </Flex>
            )}
          </Flex>
        </Flex>
        <Flex w="full">
          <Text fontSize={{ md: 'xl' }}>{post.content}</Text>
        </Flex>

        {post.imageUrl && (
          <Image
            mt={6}
            borderRadius="10px"
            w={{ md: 'xl' }}
            h={{ md: 'xl' }}
            objectFit="cover"
            src={process.env.CLIENT_URI + '/' + post.imageUrl}
            alt={post.creator.name}
          />
        )}
        <Box w="full" mt={6}>
          <Link href={'/post/' + post._id}>
            <Button variant="link" color="blue.100">
              Ver post
            </Button>
          </Link>
        </Box>
      </Flex>
    </Box>
  );
};
