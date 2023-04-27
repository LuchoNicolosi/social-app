import { handleLogout } from '@/pages';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Button, Flex, useColorMode } from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';

export const Navigate = () => {
  const { toggleColorMode } = useColorMode();
  const [isToggle, setToggle] = useState(false);

  const handleToggle = () => {
    setToggle(!isToggle);
    return toggleColorMode();
  };

  const handleLogout = () => {
    Cookies.remove('jwt');
    Cookies.remove('userId');
  };

  return (
    <Flex p={6} w="full" bg="teal" justifyContent="space-between">
      <Flex alignItems="center">
        <Link href="/">
          <Button fontSize="xl" fontWeight="bold" variant="link">
            Home
          </Button>
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
