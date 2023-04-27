import {
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
import Cookies from 'js-cookie';

const Login = () => {
  const { toggleColorMode } = useColorMode();
  const [isToggle, setToggle] = useState(false);
  const bfForm = useColorModeValue('gray.100', 'gray.700');
  const bgButton = useColorModeValue('gray.100', 'gray.800');
  const colorButton = useColorModeValue('gray.800', 'white');
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');

  const userNameChange = (e) => {
    setUserName(e.target.value);
  };
  const passwordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch('http://localhost:8080/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userName: userName,
        password: password,
      }),
    });

    if (res.status === 422) {
      throw new Error(
        "Validation failed. Make sure the email address isn't used yet!"
      );
    }
    if (res.status !== 200 && res.status !== 201) {
      throw new Error('Login a user failed!');
    }

    const data = await res.json();

    if (!data) {
      throw new Error('Something went wrong!');
    }

    Cookies.set('jwt', data.token);
    Cookies.set('userId', data.userId);
    const remainingMilliseconds = 60 * 60 * 1000;
    const expiryDate = new Date(new Date().getTime() + remainingMilliseconds);
    Cookies.set('expiryDate', expiryDate.toISOString());
    router.push('/');
  };
  return (
    <Flex justifyContent="center" h="100vh" alignItems="center">
      <Flex
        flexDir="column"
        textAlign="center"
        p={12}
        rounded={6}
        bg={bfForm}
        onSubmit={handleSubmit}
        as="form"
      >
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
        <Heading mb={6}>Login</Heading>
        <FormLabel>Username</FormLabel>
        <Input
          id="userName"
          placeholder="@jhondoe"
          variant="filled"
          mb={3}
          type="text"
          onChange={userNameChange}
        />

        <FormLabel>Password</FormLabel>
        <Input
          id="password"
          placeholder="**********"
          variant="filled"
          mb={6}
          type="password"
          onChange={passwordChange}
        />

        <Button mb={3} colorScheme="teal" type="submit">
          Login
        </Button>
        <Text>
          You do not have an account? <Link href="/signup">Sign up!</Link>
        </Text>
      </Flex>
    </Flex>
  );
};
export default Login;
