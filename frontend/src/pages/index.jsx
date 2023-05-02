import Cookies from 'js-cookie';
import { Posts } from '../../components/posts';
import {
  QueryClient,
  dehydrate,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import { CreatePost } from '../../components/createPost';
import { Flex, Text } from '@chakra-ui/react';
import { Navigate } from '../../components/navigate';
import { useEffect } from 'react';
import { io } from 'socket.io-client';

export default function Home() {
  const token = Cookies.get('jwt');
  const userId = Cookies.get('userId');
  const socket = io('http://localhost:8080');
  const queryClient = useQueryClient();

  useEffect(() => {
    socket.on('posts', () => {
      queryClient.refetchQueries();
    });
  }, [queryClient]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['posts'],
    queryFn: () =>
      fetch('http://localhost:8080/api/v1/home/posts', {
        headers: {
          Authorization: token,
        },
      }).then((res) => res.json()),
  });

  if (data.posts.length === 0)
    return (
      <>
        <Navigate />
        <Flex w="full" alignItems="center" flexDirection="column">
          <CreatePost token={token} />
          <Text mt={6} alignItems="center">
            No posts found.
          </Text>
        </Flex>
      </>
    );
  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <Flex w="full" flexDirection="column" alignItems="center">
      <Navigate />
      <CreatePost userId={userId} token={token} />
      {data.posts?.map((post) => (
        <Posts key={post._id} token={token} userId={userId} post={post} />
      ))}
    </Flex>
  );
}
export async function getServerSideProps({ req }) {
  const token = req.cookies.jwt;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(['posts'], () =>
    fetch('http://localhost:8080/api/v1/home/posts', {
      headers: {
        Authorization: token,
      },
    }).then((res) => res.json())
  );

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
}
