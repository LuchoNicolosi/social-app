import {
  Box,
  Button,
  Flex,
  FormLabel,
  Heading,
  Input,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Link } from '@chakra-ui/next-js';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { generateBase64FromImage } from '../../util/image';

const Signup = () => {
  const [isToggle, setToggle] = useState(false);
  const { toggleColorMode } = useColorMode();
  const bgButton = useColorModeValue('gray.100', 'gray.800');
  const colorButton = useColorModeValue('gray.800', 'white');
  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  const router = useRouter();
  const bfForm = useColorModeValue('gray.100', 'gray.700');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('email', email);
    formData.append('name', name);
    formData.append('userName', userName);
    formData.append('password', password);
    formData.append('imageUrl', imageUrl);

    const res = await fetch('http://localhost:8080/api/v1/auth/signup', {
      method: 'POST',
      body: formData,
    });

    if (res.status !== 200) {
      throw new Error('Creating a user failed!');
    } else {
      router.push('/login');
    }
  };

  return (
    <Flex justifyContent="center" h="100vh" alignItems="center">
      <Flex position="absolute" top="0" right="0" p="1.5em">
        <Button
          onClick={handleToggle}
          bg={bgButton}
          color={colorButton}
          colorScheme="none"
        >
          {isToggle ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Flex>
      <Flex
        flexDir="column"
        textAlign="center"
        p={12}
        rounded={6}
        bg={bfForm}
        onSubmit={handleSubmit}
        as="form"
      >
        <Heading mb={6}>Sign up</Heading>

        <FormLabel>Email</FormLabel>
        <Input
          id="email"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jhondoe@socialapp.com"
          variant="filled"
          mb={3}
          type="email"
        />

        <FormLabel>Name</FormLabel>
        <Input
          id="name"
          name="name"
          placeholder="Your name"
          variant="filled"
          mb={3}
          type="text"
          onChange={(e) => setName(e.target.value)}
        />

        <FormLabel>Photo profile</FormLabel>
        <Input
          id="imageUrl"
          name="imageUrl"
          variant="filled"
          mb={3}
          type="file"
          color="teal"
          onChange={(e) => {
            setImageUrl(e.target.files[0]);
          }}
        />

        <FormLabel>Username</FormLabel>
        <Input
          id="userName"
          name="userName"
          placeholder="@jhondoe"
          variant="filled"
          mb={3}
          type="text"
          onChange={(e) => setUserName(e.target.value)}
        />

        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          name="password"
          placeholder="**********"
          variant="filled"
          mb={6}
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button mb={3} colorScheme="teal" type="submit">
          Sign up
        </Button>
        <Box>
          Do you already have an account?<Link href="/login"> Log in!</Link>
        </Box>
      </Flex>
    </Flex>
  );
};

export default Signup;
