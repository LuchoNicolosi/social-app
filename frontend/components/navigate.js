import { handleLogout } from '@/pages';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { Box, Button, Flex, useColorMode } from '@chakra-ui/react';
import Cookies from 'js-cookie';
import Link from 'next/link';
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
    Cookies.remove('userId');
    router.push('/login');
  };

  return (
    <Flex p={6} w="full" bg="teal" justifyContent="space-between">
      <Flex alignItems="center">
        <Link href="/">
          <Button fontSize="xl" fontWeight="bold" variant="link" color="white">
            Home
          </Button>
        </Link>
      </Flex>

      <Box position="fixed" bottom={0} right={0} p={6}>
        <Button variant="outline" onClick={handleToggle}>
          {isToggle ? <SunIcon /> : <MoonIcon />}
        </Button>
      </Box>

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
  );
};
