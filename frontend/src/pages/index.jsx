import Cookies from 'js-cookie';
import { Posts } from '../../components/posts';
import { useRouter } from 'next/router';
import { QueryClient, dehydrate, useQuery } from '@tanstack/react-query';
import { CreatePost } from '../../components/createPost';
import { Flex, Text } from '@chakra-ui/react';

export default function Home() {
  const token = Cookies.get('jwt');
  const userId = Cookies.get('userId');

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
        <Flex h="80vh" justifyContent="center" alignItems="center">
          <Text>No posts found.</Text>
        </Flex>
        <CreatePost token={token} />
      </>
    );
  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>{error.message}</p>;

  return (
    <Flex w="full" flexDirection="column" alignItems="center">
      <CreatePost token={token} />
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
