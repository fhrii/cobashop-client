import {
  Button,
  Container,
  Flex,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';

const ErrorPage = () => {
  return (
    <Flex
      bg="gray.200"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
    >
      <Head>
        <title>Oops... 404: Page Not Found</title>
      </Head>
      <Container maxW="4xl">
        <Flex flexDirection="column" alignItems="center">
          <Text fontSize="8xl">😞</Text>
          <Text fontSize="6xl" textAlign="center" mb="5">
            Oops... The page you're looking for doesn't exist
          </Text>
          <Link href="/" passHref>
            <ChakraLink _hover={{ textDecoration: 'none' }}>
              <Button colorScheme="red">Back Home</Button>
            </ChakraLink>
          </Link>
        </Flex>
      </Container>
    </Flex>
  );
};

export default ErrorPage;
