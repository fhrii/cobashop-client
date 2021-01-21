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
  ButtonGroup,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Image as ChakraImage,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useEffect, useRef, useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ProductType, UserRole } from '../../../__generated__/globalTypes';
import Dashboard from '../../components/Dashboard';
import MainLayout from '../../components/MainLayout';
import { useAuth } from '../../context/AuthProvider';
import ConfirmCashMutation from '../../graphql/mutation/ConfirmCashMutation';
import ConfirmVoucherMutation from '../../graphql/mutation/ConfirmVoucherMutation';
import {
  ConfirmCash,
  ConfirmCashVariables,
} from '../../graphql/mutation/__generated__/ConfirmCash';
import {
  ConfirmVoucher,
  ConfirmVoucherVariables,
} from '../../graphql/mutation/__generated__/ConfirmVoucher';
import TransactionsQuery from '../../graphql/query/TransactionsQuery';
import { MyTransactions_myTransactions } from '../../graphql/query/__generated__/MyTransactions';
import { Transactions } from '../../graphql/query/__generated__/Transactions';
import formatMoney from '../../lib/formatMoney';
import {
  CancelTransaction,
  CancelTransactionVariables,
} from '../../graphql/mutation/__generated__/CancelTransaction';
import CancelTransactionMutation from '../../graphql/mutation/CancelTransactionMutation';
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';

interface CancelValues {
  message?: string;
}

interface ConfirmValues extends CancelValues {
  message?: string;
  voucher: string;
}

const DashboardTransactionsPage = () => {
  const { isAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth || (user && user.role === UserRole.USER))
      router.replace('/login');
  }, [isAuth, user]);

  const { data, loading } = useQuery<Transactions>(TransactionsQuery);
  const [isProcessDialogOpened, setIsProcessDialogOpened] = useState<boolean>(
    false
  );
  const [isDeleteDialogOpened, setIsDeleteDialogOpened] = useState<boolean>(
    false
  );

  const [
    processedTransaction,
    setProcessedTransaction,
  ] = useState<MyTransactions_myTransactions>();

  const cancelRef = useRef(null);

  const [confirmCash, { loading: isCashLoading }] = useMutation<
    ConfirmCash,
    ConfirmCashVariables
  >(ConfirmCashMutation, {
    errorPolicy: 'ignore',
    onCompleted: () => {
      setProcessedTransaction(undefined);
      setIsProcessDialogOpened(false);
    },
  });

  const [confirmVoucher, { loading: isVoucherLoading }] = useMutation<
    ConfirmVoucher,
    ConfirmVoucherVariables
  >(ConfirmVoucherMutation, {
    errorPolicy: 'ignore',
    onCompleted: () => {
      setProcessedTransaction(undefined);
      setIsProcessDialogOpened(false);
    },
  });

  const [
    cancelTransaction,
    { loading: cancelTransactionLoading },
  ] = useMutation<CancelTransaction, CancelTransactionVariables>(
    CancelTransactionMutation,
    {
      errorPolicy: 'ignore',
      onCompleted: () => {
        setIsDeleteDialogOpened(false);
      },
    }
  );

  const formikConfirm = useFormik<ConfirmValues>({
    initialValues: { voucher: '', message: '' },
    validationSchema: Yup.object({
      voucher:
        processedTransaction &&
        processedTransaction.productType === ProductType.VOUCHER
          ? Yup.string().required('Voucher harus diisi')
          : Yup.string(),
      message: Yup.string(),
    }),
    onSubmit: ({ voucher, message }) => {
      if (processedTransaction) {
        if (processedTransaction.productType === ProductType.CASH)
          confirmCash({
            variables: { id: processedTransaction.id, message },
            refetchQueries: [{ query: TransactionsQuery }],
          });
        else
          confirmVoucher({
            variables: { id: processedTransaction.id, message, voucher },
            refetchQueries: [{ query: TransactionsQuery }],
          });
      }
    },
  });

  const formikCancel = useFormik<CancelValues>({
    initialValues: { message: '' },
    validationSchema: Yup.object({
      message: Yup.string(),
    }),
    onSubmit: ({ message }) => {
      if (processedTransaction) {
        cancelTransaction({
          variables: { id: processedTransaction.id, message },
          refetchQueries: [{ query: TransactionsQuery }],
        });
      }
    },
  });

  if (user && user.role === UserRole.USER)
    return (
      <MainLayout>
        <Dashboard>
          <Text textAlign="center">ACCESS DENIED</Text>
        </Dashboard>
      </MainLayout>
    );

  if (!data || loading || !isAuth)
    return (
      <MainLayout>
        <Dashboard>
          <VStack align="stretch">
            <Skeleton height="5em" borderRadius="md" />
            <Skeleton height="3em" borderRadius="md" />
            <Skeleton height="4em" borderRadius="md" />
          </VStack>
        </Dashboard>
      </MainLayout>
    );

  return (
    <MainLayout>
      <Head>
        <title>Transaksi - Cobashop</title>
      </Head>
      <Dashboard>
        <VStack
          align="stretch"
          divider={<StackDivider borderColor="gray.200" />}
        >
          {data.transcations.length ? (
            data.transcations.map((transaction) => (
              <Box
                bg={
                  transaction.pending
                    ? 'gray.200'
                    : transaction.success
                    ? 'green.200'
                    : 'red.200'
                }
                p="3"
                borderRadius="md"
                key={transaction.id}
              >
                <Flex>
                  <Box flexGrow={1}>
                    <Heading as="h3" fontSize="xl">
                      {transaction.itemValue}
                    </Heading>
                    <Text>{transaction.productName}</Text>
                    <Text>{transaction.productType}</Text>
                    {transaction.productType === ProductType.VOUCHER && (
                      <Text>
                        Kode Voucher: <b>{transaction.voucher}</b>
                      </Text>
                    )}
                  </Box>
                  <Box>
                    <Text textAlign="right">
                      {transaction.pending
                        ? 'Pending'
                        : transaction.success
                        ? 'Berhasil'
                        : 'Gagal'}
                    </Text>
                    <Text>{formatMoney.format(transaction.itemPrice)}</Text>
                  </Box>
                </Flex>
                <Flex alignItems="center" mt="2">
                  <Text flexGrow={1} mr="4">
                    {transaction.message}
                  </Text>
                  {transaction.pending && (
                    <ButtonGroup alignSelf="flex-end">
                      <Button
                        colorScheme="green"
                        onClick={() => {
                          setProcessedTransaction(transaction);
                          setIsProcessDialogOpened(true);
                        }}
                      >
                        Proses
                      </Button>
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          setProcessedTransaction(transaction);
                          setIsDeleteDialogOpened(true);
                        }}
                      >
                        Batalkan
                      </Button>
                    </ButtonGroup>
                  )}
                </Flex>
              </Box>
            ))
          ) : (
            <Text textAlign="center">Belum ada transaksi apapun</Text>
          )}
        </VStack>
      </Dashboard>
      <Modal
        isOpen={isProcessDialogOpened}
        onClose={() => {
          formikConfirm.setTouched({ message: false, voucher: false });
          formikConfirm.setErrors({ message: undefined, voucher: undefined });
          formikConfirm.setValues({ message: '', voucher: '' });
          setIsProcessDialogOpened(false);
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={formikConfirm.handleSubmit}>
            <ModalHeader>Proses Transaksi</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text>
                Nama:{' '}
                <b>
                  {processedTransaction?.itemValue} -{' '}
                  {processedTransaction?.productName}
                </b>
              </Text>
              <Text>
                Harga:{' '}
                <b>
                  {processedTransaction &&
                    formatMoney.format(processedTransaction?.itemPrice)}
                </b>
              </Text>
              <Text>
                Tipe: <b>{processedTransaction?.productType}</b>
              </Text>
              {processedTransaction?.primaryFormName && (
                <Text>
                  {processedTransaction?.primaryFormName}:{' '}
                  <b>{processedTransaction?.primaryFormValue}</b>
                </Text>
              )}
              {processedTransaction?.secondaryFormName && (
                <Text>
                  {processedTransaction?.secondaryFormName}:{' '}
                  <b>{processedTransaction?.secondaryFormValue}</b>
                </Text>
              )}
              <Text>
                Bukti Pembayaran:{' '}
                <b>
                  {processedTransaction &&
                    !processedTransaction.proofOfPayment &&
                    '-'}
                </b>
              </Text>
              {processedTransaction && processedTransaction.proofOfPayment && (
                <ChakraImage
                  src={processedTransaction.proofOfPayment}
                  alt="Bukti pembayaran"
                  my="2"
                />
              )}
              {processedTransaction &&
                processedTransaction.productType === ProductType.VOUCHER && (
                  <FormControl
                    mb="2"
                    id="voucher"
                    isInvalid={
                      formikConfirm.touched.voucher &&
                      !!formikConfirm.errors.voucher
                    }
                  >
                    <FormLabel>Voucher</FormLabel>
                    <Input
                      name="voucher"
                      onChange={formikConfirm.handleChange}
                      onBlur={formikConfirm.handleBlur}
                      value={formikConfirm.values.voucher}
                      type="text"
                    />
                    <FormErrorMessage>
                      {formikConfirm.errors.voucher}
                    </FormErrorMessage>
                  </FormControl>
                )}
              <FormControl
                id="pesan"
                isInvalid={
                  formikConfirm.touched.message &&
                  !!formikConfirm.errors.message
                }
              >
                <FormLabel>Pesan</FormLabel>
                <Input
                  type="text"
                  name="message"
                  onChange={formikConfirm.handleChange}
                  onBlur={formikConfirm.handleBlur}
                  value={formikConfirm.values.message}
                  placeholder="Pesanan berhasil dilakukan"
                />
                <FormErrorMessage>
                  {formikConfirm.errors.message}
                </FormErrorMessage>
              </FormControl>
            </ModalBody>
            <ModalFooter>
              <ButtonGroup>
                <Button
                  type="button"
                  onClick={() => {
                    formikConfirm.setTouched({
                      message: false,
                      voucher: false,
                    });
                    formikConfirm.setErrors({
                      message: undefined,
                      voucher: undefined,
                    });
                    formikConfirm.setValues({ message: '', voucher: '' });
                    setIsProcessDialogOpened(false);
                  }}
                >
                  Tutup
                </Button>
                <Button
                  type="submit"
                  isLoading={isCashLoading || isVoucherLoading}
                  colorScheme="blue"
                  onClick={() => {}}
                >
                  Konfirmasi
                </Button>
              </ButtonGroup>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteDialogOpened}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          formikCancel.setTouched({ message: false });
          formikCancel.setErrors({ message: undefined });
          formikCancel.setValues({ message: '' });
          setIsDeleteDialogOpened(false);
        }}
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <form onSubmit={formikCancel.handleSubmit}>
              <AlertDialogHeader fontSize="lg" fontWeight="bold">
                Batalkan Transaksi
              </AlertDialogHeader>
              <AlertDialogBody>
                <Text>
                  Nama:{' '}
                  <b>
                    {processedTransaction?.itemValue} -{' '}
                    {processedTransaction?.productName}
                  </b>
                </Text>
                <Text>
                  Harga:{' '}
                  <b>
                    {processedTransaction &&
                      formatMoney.format(processedTransaction?.itemPrice)}
                  </b>
                </Text>
                <Text>
                  Tipe: <b>{processedTransaction?.productType}</b>
                </Text>
                {processedTransaction?.primaryFormName && (
                  <Text>
                    {processedTransaction?.primaryFormName}:{' '}
                    <b>{processedTransaction?.primaryFormValue}</b>
                  </Text>
                )}
                {processedTransaction?.secondaryFormName && (
                  <Text>
                    {processedTransaction?.secondaryFormName}:{' '}
                    <b>{processedTransaction?.secondaryFormValue}</b>
                  </Text>
                )}
                <FormControl
                  id="pesanError"
                  isInvalid={
                    formikCancel.touched.message &&
                    !!formikCancel.errors.message
                  }
                >
                  <FormLabel>Pesan</FormLabel>
                  <Input
                    type="text"
                    name="message"
                    onChange={formikCancel.handleChange}
                    onBlur={formikCancel.handleBlur}
                    value={formikCancel.values.message}
                    placeholder="Pesanan dibatalkan oleh Admin"
                  />
                  <FormErrorMessage>
                    {formikCancel.errors.message}
                  </FormErrorMessage>
                </FormControl>
              </AlertDialogBody>
              <AlertDialogFooter>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    formikCancel.setTouched({ message: false });
                    formikCancel.setErrors({ message: undefined });
                    formikCancel.setValues({ message: '' });
                    setIsDeleteDialogOpened(false);
                  }}
                >
                  Tutup
                </Button>
                <Button
                  type="submit"
                  colorScheme="red"
                  isLoading={cancelTransactionLoading}
                  ml={3}
                >
                  Batalkan
                </Button>
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MainLayout>
  );
};

export default DashboardTransactionsPage;
