import { useMutation } from '@apollo/client';
import {
  Alert,
  AlertIcon,
  Button,
  Center,
  CloseButton,
  Container,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Grid,
  Input,
  Link as ChakraLink,
  Text,
} from '@chakra-ui/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Image from 'next/image';
import Link from 'next/link';
import LoginMutation from '../graphql/mutation/LoginMutation';
import { Login, LoginVariables } from '../graphql/mutation/__generated__/Login';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthProvider';
import Head from 'next/head';

interface Values {
  username: string;
  password: string;
}

const LoginPage = () => {
  const router = useRouter();
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  const formik = useFormik<Values>({
    initialValues: { username: '', password: '' },
    validationSchema: Yup.object({
      username: Yup.string().required('Username harus diisi'),
      password: Yup.string().required('Password harus diisi'),
    }),
    onSubmit: (values) => {
      if (!isFetching) {
        setIsFetching(true);
        userLogin({ variables: { ...values } });
      }
    },
  });

  const [userLogin] = useMutation<Login, LoginVariables>(LoginMutation, {
    onCompleted: () => {
      router.replace('/');
    },
    onError: () => {
      setIsFetching(false);
      setIsFailed(true);
    },
  });

  const { isAuth } = useAuth();

  useEffect(() => {
    if (isAuth) router.push('/');
  }, [isAuth]);

  return (
    <Flex minHeight="100vh" justifyContent="center" alignItems="center" p="5">
      <Head>
        <title>Login - Cobashop</title>
      </Head>
      <Container maxW="xl">
        <Center mb="5">
          <Link href="/" passHref>
            <a>
              <Image src="/logo.png" width={200} height={40} />
            </a>
          </Link>
        </Center>
        <form onSubmit={formik.handleSubmit}>
          <Grid boxShadow="lg" borderRadius="md" p="5" mb="5" gap="5">
            <FormControl
              id="username"
              isInvalid={formik.touched.username && !!formik.errors.username}
            >
              <FormLabel>Username</FormLabel>
              <Input
                type="text"
                name="username"
                size="lg"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.username}
              />
              <FormErrorMessage>{formik.errors.username}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="password"
              isInvalid={formik.touched.password && !!formik.errors.password}
            >
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                name="password"
                size="lg"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
              <FormErrorMessage>{formik.errors.password}</FormErrorMessage>
            </FormControl>
            <Button
              type="submit"
              size="lg"
              colorScheme="yellow"
              isLoading={isFetching}
            >
              Masuk
            </Button>
            {isFailed && (
              <Alert status="error">
                <AlertIcon />
                Username atau password salah
                <CloseButton
                  position="absolute"
                  right="0.5em"
                  top="0.75em"
                  onClick={() => setIsFailed(false)}
                />
              </Alert>
            )}
          </Grid>
        </form>
        <Center>
          <Text>
            Belum punya akun?{' '}
            <Link href="/register" passHref>
              <ChakraLink>Daftar</ChakraLink>
            </Link>
          </Text>
        </Center>
      </Container>
    </Flex>
  );
};

export default LoginPage;
