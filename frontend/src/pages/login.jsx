import {
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Text,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';
import { MoonIcon, SunIcon, ViewIcon, ViewOffIcon } from '@chakra-ui/icons';
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
  const [loading, setLoading] = useState(false);
  const [userNameError, setUserNameError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);

  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setUserNameError(false);
    setPasswordError(false);

    const res = await fetch(process.env.SERVER_URL + '/api/v1/auth/login', {
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
      const errorData = await res.json();
      if (errorData.errorMessage === 'Username does not exist!') {
        setUserNameError(errorData.errorMessage);
      } else if (errorData.errorMessage === 'Incorrect password!') {
        setUserNameError(false);
        setPasswordError(errorData.errorMessage);
      }
      return;
    }

    const data = await res.json();
    Cookies.set('jwt', data.token);
    Cookies.set('userId', data.userId);
    setLoading(false);
    router.push('/');
  };
  return (
    <Flex justifyContent="center" h="100vh" alignItems="center" px={4}>
      <Flex
        flexDir="column"
        textAlign="center"
        p={12}
        rounded={6}
        bg={bfForm}
        onSubmit={handleSubmit}
        as="form"
      >
        <Flex
          position="absolute"
          top="0"
          right="0"
          p={{ base: '0.5em', md: '1.5em' }}
        >
          <Button
            onClick={handleToggle}
            bg={bgButton}
            color={colorButton}
            colorScheme="none"
          >
            {isToggle ? <SunIcon /> : <MoonIcon />}
          </Button>
        </Flex>
        <Heading mb={6}>Log in</Heading>
        <FormControl mb={3} isInvalid={userNameError}>
          <FormLabel>Username</FormLabel>
          <InputGroup>
            <InputLeftAddon children="@" />
            <Input
              id="userName"
              name="userName"
              isInvalid={userNameError}
              errorBorderColor="crimson"
              placeholder="jhondoe"
              type="text"
              onChange={(e) => setUserName(e.target.value)}
            />
            {userNameError && (
              <FormErrorMessage>{userNameError}</FormErrorMessage>
            )}
          </InputGroup>
        </FormControl>

        <FormControl mb={6} isInvalid={passwordError}>
          <FormLabel>Password</FormLabel>
          <InputGroup>
            <Input
              id="password"
              name="password"
              isInvalid={passwordError}
              errorBorderColor="crimson"
              placeholder="**********"
              type={show ? 'text' : 'password'}
              onChange={(e) => setPassword(e.target.value)}
            />
            <InputRightElement width="4.5rem">
              <Button h="1.75rem" size="sm" onClick={handleClick}>
                {show ? <ViewOffIcon /> : <ViewIcon />}
              </Button>
            </InputRightElement>
          </InputGroup>
          {passwordError && (
            <FormErrorMessage>{passwordError}</FormErrorMessage>
          )}
        </FormControl>

        <Button isLoading={loading} mb={3} colorScheme="teal" type="submit">
          Login
        </Button>
        <Text px={{ base: 6 }}>
          You do not have an account?{' '}
          <Link href="/signup" fontWeight="bold">
            Sign up!
          </Link>
        </Text>
      </Flex>
    </Flex>
  );
};
export default Login;
