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
  Heading,
  Image as ChakraImage,
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
import { useRouter } from 'next/dist/client/router';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { ProductType, UserRole } from '../../../__generated__/globalTypes';
import Dashboard from '../../components/Dashboard';
import MainLayout from '../../components/MainLayout';
import { useAuth } from '../../context/AuthProvider';
import AddProofOfPaymentMutation from '../../graphql/mutation/AddProofOfPaymentMutation';
import CancelMyTransactionMutation from '../../graphql/mutation/CancelMyTransaction';
import {
  AddProofOfPayment,
  AddProofOfPaymentVariables,
} from '../../graphql/mutation/__generated__/AddProofOfPayment';
import {
  CancelMyTransaction,
  CancelMyTransactionVariables,
} from '../../graphql/mutation/__generated__/CancelMyTransaction';
import MyTransactionsQuery from '../../graphql/query/MyTransactionsQuery';
import {
  MyTransactions,
  MyTransactions_myTransactions,
} from '../../graphql/query/__generated__/MyTransactions';
import formatMoney from '../../lib/formatMoney';

const DashboardPage = () => {
  const { isAuth, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) router.replace('/login');
  }, [isAuth]);

  const { data, loading } = useQuery<MyTransactions>(MyTransactionsQuery);
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

  const uploadElement = useRef<HTMLInputElement>(null);

  const cancelRef = useRef(null);

  const acceptedExtension = ['.jpg', '.jpeg', '.png'];
  const [fileImage, setFileImage] = useState<File>();
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isUploadingImage, setIsUploadingImage] = useState<boolean>(false);

  const [addProofOfPayment] = useMutation<
    AddProofOfPayment,
    AddProofOfPaymentVariables
  >(AddProofOfPaymentMutation, {
    errorPolicy: 'ignore',
    onCompleted: () => {
      setIsProcessDialogOpened(false);
      setFileImage(undefined);
      setPreviewImage('');
      setIsUploadingImage(false);
    },
  });

  const [
    cancelTransaction,
    { loading: cancelTransactionLoading },
  ] = useMutation<CancelMyTransaction, CancelMyTransactionVariables>(
    CancelMyTransactionMutation,
    {
      errorPolicy: 'ignore',
      onCompleted: () => {
        setIsDeleteDialogOpened(false);
      },
    }
  );

  useEffect(() => {
    if (fileImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target) {
          setPreviewImage(e.target.result + '');
        }
      };
      reader.readAsDataURL(fileImage);
    }
  }, [fileImage]);

  if (user && user.role === UserRole.ADMIN)
    return (
      <MainLayout>
        <Dashboard>
          <Text textAlign="center">
            Anda seorang admin, tidak bisa memiliki transaksi apapun
          </Text>
        </Dashboard>
      </MainLayout>
    );

  if (!data || loading)
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
          {data.myTransactions.length ? (
            data.myTransactions.map((transaction) => (
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
                        Bukti Pembayaran
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
            <Text textAlign="center">Kamu belum memiliki transaksi apapun</Text>
          )}
        </VStack>
      </Dashboard>
      <Modal
        isOpen={isProcessDialogOpened}
        onClose={() => {
          setFileImage(undefined);
          setPreviewImage('');
          setIsProcessDialogOpened(false);
        }}
        size="xl"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Bukti Pembayaran</ModalHeader>
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
            <Text>
              Bukti Pembayaran:{' '}
              <b>
                {!previewImage &&
                  processedTransaction &&
                  !processedTransaction.proofOfPayment &&
                  '-'}
              </b>
            </Text>
            {previewImage ? (
              <ChakraImage src={previewImage} alt="Bukti pembayaran" mt="2" />
            ) : (
              processedTransaction &&
              processedTransaction.proofOfPayment && (
                <ChakraImage
                  src={processedTransaction.proofOfPayment}
                  alt="Bukti pembayaran"
                  mt="2"
                />
              )
            )}
            <Text mt="4" color="red.600">
              Note: Ukuran file foto bukti pembayaran tidak boleh lebih dari 1MB
              dan harus berekstensi .jpg/.jpeg/.png
            </Text>
          </ModalBody>
          <ModalFooter>
            <ButtonGroup>
              <input
                type="file"
                ref={uploadElement}
                style={{ display: 'none' }}
                accept=".png,.jpg,.jpeg"
                size={1048576}
                onChange={(e) => {
                  const file =
                    e.target.files &&
                    e.target.files.length &&
                    e.target.files[0];

                  if (file && file.size <= 1048576) {
                    const splitedName = file.name.split('.');
                    const ext = '.' + splitedName[splitedName.length - 1];

                    if (acceptedExtension.includes(ext)) {
                      setFileImage(file);
                    }
                  }
                }}
              />
              <Button
                colorScheme="green"
                onClick={() => uploadElement.current?.click()}
              >
                Upload Bukti Pembayaran
              </Button>
              <Button
                colorScheme="blue"
                isLoading={isUploadingImage}
                onClick={() => {
                  if (processedTransaction && fileImage && previewImage) {
                    setIsUploadingImage(true);
                    const formData = new FormData();
                    formData.append('file', fileImage);
                    formData.append('upload_preset', 'ml_default');
                    const options = {
                      method: 'POST',
                      body: formData,
                    };

                    fetch(process.env.NEXT_PUBLIC_CLOUD_SERVER!, options)
                      .then((res) => res.json())
                      .then((res) => {
                        addProofOfPayment({
                          variables: {
                            id: processedTransaction.id,
                            image: res.secure_url,
                          },
                          refetchQueries: [{ query: MyTransactionsQuery }],
                        });
                      })
                      .catch(() => {});
                  } else setIsProcessDialogOpened(false);
                }}
              >
                Konfirmasi
              </Button>
            </ButtonGroup>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <AlertDialog
        isOpen={isDeleteDialogOpened}
        leastDestructiveRef={cancelRef}
        onClose={() => setIsDeleteDialogOpened(false)}
        size="xl"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
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
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button
                ref={cancelRef}
                onClick={() => setIsDeleteDialogOpened(false)}
              >
                Tutup
              </Button>
              <Button
                colorScheme="red"
                isLoading={cancelTransactionLoading}
                onClick={() => {
                  if (processedTransaction)
                    cancelTransaction({
                      variables: { id: processedTransaction.id },
                      refetchQueries: [{ query: MyTransactionsQuery }],
                    });
                }}
                ml={3}
              >
                Batalkan
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MainLayout>
  );
};

export default DashboardPage;
