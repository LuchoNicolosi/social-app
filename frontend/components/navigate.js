import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  useColorMode,
  // useColorModeValue,
} from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Link from 'next/link';
import { AiFillHome } from 'react-icons/ai';
import { useRouter } from 'next/router';
import { useState } from 'react';

export const Navigate = () => {
  const { toggleColorMode } = useColorMode();
  const [isToggle, setToggle] = useState(false);
  const router = useRouter();

  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  const handleLogout = () => {
    Cookies.remove('jwt');
    Cookies.remove('expiryDate');
    Cookies.remove('userId');
    router.push('/login');
  };

  // const bgButton = useColorModeValue('teal.100', 'teal.700');
  return (
    <Flex p={6} w="full" bg="teal" justifyContent="space-between">
      <Flex alignItems="center">
        <Link href="/">
          <AiFillHome size="30px" color="white" />
        </Link>
      </Flex>
      <Flex gap={2}>
        <Button
          onClick={handleToggle}
          bg="white"
          color="black"
          _hover={{ bg: 'gray.200' }}
        >
          {isToggle ? <SunIcon /> : <MoonIcon />}
        </Button>
        <Button
          bg="white"
          color="black"
          _hover={{ bg: 'gray.200' }}
          fontWeight="bold"
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};
