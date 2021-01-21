import { useMutation, useQuery } from '@apollo/client';
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  HStack,
  IconButton,
  Input,
  Link as ChakraLink,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  SkeletonText,
  Text,
  useRadioGroup,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import Image from 'next/image';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProductType } from '../../../__generated__/globalTypes';
import MainLayout from '../../components/MainLayout';
import ProductQuery from '../../graphql/query/ProductQuery';
import RadioCard from '../../components/RadioCard';
import {
  Product,
  ProductVariables,
} from '../../graphql/query/__generated__/Product';
import { useEffect, useRef, useState } from 'react';
import BuyItemMutation from '../../graphql/mutation/BuyItemMutation';
import {
  BuyItem,
  BuyItemVariables,
} from '../../graphql/mutation/__generated__/BuyItem';
import { QuestionIcon } from '@chakra-ui/icons';
import { useAuth } from '../../context/AuthProvider';
import formatMoney from '../../lib/formatMoney';
import Link from 'next/link';

interface Values {
  primaryFormValue?: string;
  secondaryFormValue?: string;
  itemId: string;
}

const ProductPage = () => {
  const router = useRouter();
  const { isAuth } = useAuth();
  const id = router.query.id as string;

  const { data, loading } = useQuery<Product, ProductVariables>(ProductQuery, {
    variables: { id },
  });

  const [buyItem, { loading: isBuying }] = useMutation<
    BuyItem,
    BuyItemVariables
  >(BuyItemMutation, {
    onCompleted: () => {
      setIsSuccess(true);
    },
    onError: () => {
      setIsFailed(true);
    },
  });

  const [isHelperOpened, setIsHelperOpened] = useState<boolean>(false);

  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const cancelRef = useRef(null);

  const formik = useFormik<Values>({
    initialValues: { primaryFormValue: '', secondaryFormValue: '', itemId: '' },
    validationSchema: Yup.object({
      primaryFormValue:
        data?.product.type === ProductType.CASH
          ? Yup.string().required(
              `${data?.product.primaryFormName} harus diisi`
            )
          : Yup.string(),
      secondaryFormValue:
        data?.product.type === ProductType.CASH &&
        data.product.secondaryFormName
          ? Yup.string().required(
              `${data.product.secondaryFormName} harus diisi`
            )
          : Yup.string(),
      itemId: Yup.string().required('Item harus dipilih'),
    }),
    onSubmit: (values) => {
      if (isAuth)
        buyItem({
          variables: {
            id: values.itemId,
            primaryFormValue: values.primaryFormValue
              ? values.primaryFormValue
              : undefined,
            secondaryFormValue: values.secondaryFormValue
              ? values.secondaryFormValue
              : undefined,
          },
          update: (cache, { data: newData }) => {
            cache.modify({
              id: 'ROOT_QUERY',
              fields: {
                myTransactions: (cachedTransactions) => {
                  return [newData && newData.buyItem, ...cachedTransactions];
                },
              },
            });
          },
        });
      else router.replace('/login');
    },
  });

  const { getRootProps, getRadioProps } = useRadioGroup({
    name: 'itemId',
    onChange: (value: string) => {
      formik.setValues((state) => ({ ...state, itemId: value }));
    },
  });

  const group = getRootProps();

  useEffect(() => {
    if (formik.values.itemId)
      formik.setTouched({ ...formik.touched, itemId: true });
  }, [formik.values.itemId]);

  if (!data || loading)
    return (
      <MainLayout>
        <Flex flexDirection={{ base: 'column', md: 'row' }}>
          <Box
            flexBasis={{ md: '20em' }}
            mr={{ md: 5 }}
            mb={{ base: 3, md: 0 }}
            flexShrink={1}
          >
            <Skeleton height={{ base: '5em', sm: '7em', md: '9em' }} mb="2" />
            <SkeletonText mb="2" />
            <SkeletonText />
          </Box>
          <Box flexGrow={1}>
            <VStack align="stretch" spacing={1}>
              <Skeleton height={{ base: '5em', sm: '7em', md: '9em' }} mb="2" />
              <Skeleton height={{ base: '5em', sm: '7em', md: '9em' }} mb="2" />
            </VStack>
          </Box>
        </Flex>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Head>
        <title>{data.product.name} - Cobashop</title>
      </Head>
      <Flex flexDirection={{ base: 'column', md: 'row' }}>
        <Box
          flexBasis={{ md: '20em' }}
          mr={{ md: 5 }}
          mb={{ base: 3, md: 0 }}
          flexShrink={0}
        >
          <Box minHeight="8em" overflow="hidden" position="relative">
            <Image src={data.product.banner} layout="fill" />
          </Box>
          <Heading fontSize="xl" fontWeight="bold" my="2">
            {data.product.name}
          </Heading>
          <Text>{data.product.description}</Text>
        </Box>
        <Box flexGrow={1}>
          <form onSubmit={formik.handleSubmit}>
            <VStack align="stretch" spacing={5}>
              {data.product.type === ProductType.CASH && (
                <Box bg="gray.100" p="2" borderRadius="lg" shadow="lg">
                  <Heading as="h2" fontSize="xl" mb="2">
                    Masukan {data.product.primaryFormName}
                    {data.product.helperImage && data.product.helperText && (
                      <IconButton
                        ml="1"
                        size="xs"
                        aria-label={`Cara mencari ${data.product.primaryFormName}`}
                        onClick={() => setIsHelperOpened(true)}
                      >
                        <QuestionIcon />
                      </IconButton>
                    )}
                  </Heading>
                  <HStack>
                    <FormControl
                      id="primaryFormValue"
                      isInvalid={
                        formik.touched.primaryFormValue &&
                        !!formik.errors.primaryFormValue
                      }
                    >
                      <Input
                        placeholder={`${data.product.primaryFormName}`}
                        bg="white"
                        name="primaryFormValue"
                        size="lg"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.primaryFormValue}
                      />
                    </FormControl>
                    {data.product.secondaryFormName && (
                      <FormControl
                        id="secondaryFormValue"
                        isInvalid={
                          formik.touched.secondaryFormValue &&
                          !!formik.errors.secondaryFormValue
                        }
                      >
                        <Input
                          placeholder={`${data.product.secondaryFormName}`}
                          bg="white"
                          name="secondaryFormValue"
                          size="lg"
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          value={formik.values.secondaryFormValue}
                        />
                      </FormControl>
                    )}
                  </HStack>
                  {data.product.helperText && (
                    <Text fontSize="xs" mt="2">
                      {data.product.helperText}{' '}
                    </Text>
                  )}
                </Box>
              )}
              <Box bg="gray.100" p="2" borderRadius="lg" shadow="lg">
                <Heading as="h2" fontSize="xl" mb="2">
                  Pilih{' '}
                  {data.product.type === ProductType.CASH
                    ? 'Nominal Top-Up'
                    : 'Voucher'}
                </Heading>
                {formik.touched.itemId && !!formik.errors.itemId && (
                  <Text mb={2} color="red.500">
                    {formik.errors.itemId}
                  </Text>
                )}
                {data.product.items.length ? (
                  <SimpleGrid
                    {...group}
                    columns={{ base: 2, md: 3 }}
                    spacing={3}
                  >
                    {data.product.items.map(({ id, value, price }) => {
                      const radio = getRadioProps({
                        value: id,
                        enterKeyHint: value,
                      });
                      return (
                        <RadioCard key={id} {...radio}>
                          <Box textAlign="center">
                            <Text>{value}</Text>
                            <Text>{formatMoney.format(price)}</Text>
                          </Box>
                        </RadioCard>
                      );
                    })}
                  </SimpleGrid>
                ) : (
                  <Text>Maaf saat ini tidak ada item yang tersedia</Text>
                )}
              </Box>
              <Button
                type="submit"
                size="lg"
                colorScheme="yellow"
                isLoading={isBuying}
              >
                Beli
              </Button>
            </VStack>
          </form>
        </Box>
      </Flex>
      <AlertDialog
        isOpen={isFailed || isSuccess}
        leastDestructiveRef={cancelRef}
        onClose={() => (isFailed ? setIsFailed(false) : setIsSuccess(false))}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isFailed ? 'Transaksi Gagal' : 'Transaksi Berhasil'}
            </AlertDialogHeader>
            <AlertDialogBody>
              {isFailed ? (
                <Text>
                  Transaksi gagal dilakukan, silahkan coba beberapa saat lagi.
                </Text>
              ) : (
                <Text>
                  Transaksi berhasil, silahkan lanjutkan proses pembayaran{' '}
                  <Link href="/dashboard" passHref>
                    <ChakraLink textDecoration="underline">
                      Upload bukti pembayaran
                    </ChakraLink>
                  </Link>
                </Text>
              )}
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() =>
                  isFailed ? setIsFailed(false) : setIsSuccess(false)
                }
              >
                Tutup
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      {data.product.helperImage && data.product.helperText && (
        <Modal
          isOpen={isHelperOpened}
          onClose={() => setIsHelperOpened(false)}
          size="xl"
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Cara mencari {data.product.primaryFormName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Image
                src={data.product.helperImage}
                alt={`cara mencari ${data.product.primaryFormName}`}
                width={200}
                height={40}
                layout="responsive"
              />
              <Text my="2">{data.product.helperText}</Text>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </MainLayout>
  );
};

export default ProductPage;
