import Image from 'next/image';
import Link from 'next/link';
import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import { useAuth } from '../context/AuthProvider';
import { useState } from 'react';
import { Logout } from '../graphql/mutation/__generated__/Logout';
import LogoutMutation from '../graphql/mutation/LogoutMutation';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/dist/client/router';

const Navbar = () => {
  const [logout] = useMutation<Logout>(LogoutMutation, {
    errorPolicy: 'ignore',
  });
  const [isMenuOpened, setIsMenuOpened] = useState<boolean>(false);
  const { isAuth, user, refetchAuth } = useAuth();
  const router = useRouter();

  return (
    <Box>
      <Box bg="yellow.400" p="1" />
      <Container maxW="4xl" py="5">
        <Flex alignItems="center">
          <Box flexGrow={1} pr="5">
            <Link href="/" passHref>
              <a>
                <Image src="/logo.png" alt="Cobashop" width={200} height={40} />
              </a>
            </Link>
          </Box>
          {isAuth && user ? (
            <Box
              as="button"
              outline="none"
              position="relative"
              cursor="default"
              onClick={() => setIsMenuOpened((state) => !state)}
            >
              <Avatar name={user.username} src={user.image} cursor="pointer" />
              <Box
                display={isMenuOpened ? 'block' : 'none'}
                shadow="lg"
                borderRadius="md"
                position="absolute"
                top="3.5em"
                right="0"
                minW="15em"
                overflow="hidden"
                zIndex="1"
              >
                <Box
                  bgImage={`url(${user.image})`}
                  bgRepeat="no-repeat"
                  bgSize="cover"
                  bgPos="center center"
                  width="100%"
                  height="8em"
                ></Box>
                <Flex
                  textAlign="right"
                  flexDirection="column"
                  py="2"
                  bgColor="white"
                >
                  <Text px="3" py="1">
                    <b>{user.username}</b>
                  </Text>
                  <Link href="/dashboard" passHref>
                    <ChakraLink
                      px="3"
                      py="1"
                      _hover={{ textDecoration: 'none', bg: 'gray.100' }}
                    >
                      <Text>Dashboard</Text>
                    </ChakraLink>
                  </Link>
                  <ChakraLink
                    px="3"
                    py="1"
                    _hover={{ textDecoration: 'none', bg: 'gray.100' }}
                    onClick={() => {
                      logout({
                        update: (cache) => {
                          if (user) {
                            refetchAuth()
                              .then(() => {
                                cache.reset().then(() => {
                                  router.replace('/');
                                });
                              })
                              .catch(() => {});
                          }

                          return;
                        },
                      });
                    }}
                  >
                    <Text>Keluar</Text>
                  </ChakraLink>
                </Flex>
              </Box>
            </Box>
          ) : (
            <Link href="/login" passHref>
              <ChakraLink _hover={{ textDecoration: 'none' }}>
                <Button colorScheme="yellow">Masuk</Button>
              </ChakraLink>
            </Link>
          )}
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;
