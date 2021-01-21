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
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Input,
  Select,
  Skeleton,
  Textarea,
  VStack,
} from '@chakra-ui/react';
import { FormikErrors, useFormik } from 'formik';
import * as Yup from 'yup';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useRef, useState } from 'react';
import { ProductType, UserRole } from '../../../../__generated__/globalTypes';
import Dashboard from '../../../components/Dashboard';
import MainLayout from '../../../components/MainLayout';
import { useAuth } from '../../../context/AuthProvider';
import { useMutation, useQuery } from '@apollo/client';
import ProductQuery from '../../../graphql/query/ProductQuery';
import {
  Product,
  ProductVariables,
} from '../../../graphql/query/__generated__/Product';
import {
  EditProduct,
  EditProductVariables,
} from '../../../graphql/mutation/__generated__/EditProduct';
import EditProductMutation from '../../../graphql/mutation/EditProductMutation';
import ProductsQuery from '../../../graphql/query/ProductsQuery';
import Head from 'next/head';

interface ItemValues {
  identity: number;
  id?: string;
  value: string;
  price: number;
}

interface Values {
  name: string;
  type: ProductType;
  primaryFormName: string;
  secondaryFormName: string;
  image: string;
  banner: string;
  description: string;
  helperImage: string;
  helperText: string;
  items: ItemValues[];
}

const DashboardEditItem = () => {
  const { isAuth, user } = useAuth();
  const router = useRouter();
  const id = router.query.id as string;

  useEffect(() => {
    if (!isAuth || (user && user.role === UserRole.USER))
      router.replace('/login');
  }, [isAuth]);

  const [identity, setIdentity] = useState<number>(1);

  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [isFailed, setIsFailed] = useState<boolean>(false);
  const [isDeleted, setIsDeleted] = useState<boolean>(false);
  const cancelRef = useRef(null);

  const { data, loading } = useQuery<Product, ProductVariables>(ProductQuery, {
    variables: { id },
    onError: () => {
      router.push('/404');
    },
    onCompleted: ({ product }) => {
      if (product.deleted) router.push('/404');
      let idnty: number = 1;

      formik.setValues((values) => ({
        name: product.name,
        type: product.type,
        primaryFormName: product.primaryFormName || values.primaryFormName,
        secondaryFormName:
          product.secondaryFormName || values.secondaryFormName,
        image: product.image,
        banner: product.image,
        description: product.description,
        helperImage: product.helperImage || values.helperImage,
        helperText: product.helperText || values.helperText,
        items: product.items.length
          ? product.items.map((itm) => ({ identity: ++idnty, ...itm }))
          : values.items,
      }));

      setIdentity(idnty);
    },
  });

  const [editProduct, { loading: uploadingProduct }] = useMutation<
    EditProduct,
    EditProductVariables
  >(EditProductMutation, {
    onCompleted: () => {
      if (isSuccess) setIsSuccess(false);
      if (isDeleted) {
        setIsDeleted(false);
        router.push('/dashboard/edit');
      }
    },
    onError: () => {
      if (isFailed) setIsFailed(false);
      if (isDeleted) {
        setIsDeleted(false);
        setIsFailed(true);
      }
    },
  });

  const formik = useFormik<Values>({
    initialValues: {
      name: '',
      type: ProductType.CASH,
      primaryFormName: '',
      secondaryFormName: '',
      image: '',
      banner: '',
      description: '',
      helperImage: '',
      helperText: '',
      items: [{ identity, value: '', price: 0 }],
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Nama produk harus diisi'),
      type: Yup.mixed<ProductType>()
        .oneOf(Object.values(ProductType))
        .required('Tipe produk harus diisi'),
      primaryFormName: Yup.string().when('type', {
        is: (val: ProductType) => val === ProductType.CASH,
        then: Yup.string().required('Nama Id harus diisi'),
      }),
      secondaryFormName: Yup.string(),
      image: Yup.string()
        .url('Thumbnail harus berupa URL')
        .required('Thumbnail harus diisi'),
      banner: Yup.string()
        .url('Banner harus berupa URL')
        .required('Banner harus diisi'),
      description: Yup.string().required('Deskripsi harus diisi'),
      helperText: Yup.string(),
      helperImage: Yup.string().url('Gambar Tip harus berupa URL'),
      items: Yup.array()
        .of(
          Yup.object({
            value: Yup.string().required('Nama Item harus diisi'),
            price: Yup.number()
              .min(1000, 'Harga minimal harus Rp1,000.00')
              .required('Harga Item harus diisi'),
          })
        )
        .required('Items harus diisi'),
    }),
    onSubmit: (values) => {
      const items = values.items.map((item) => ({
        id: item.id,
        value: item.value,
        price: item.price,
      }));

      editProduct({
        variables: { id, ...values, items },
        refetchQueries: [
          { query: ProductQuery, variables: { id } },
          { query: ProductsQuery },
        ],
      });
    },
  });

  if (!isAuth || !data || loading)
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
        <title>Ubah Produk - Cobashop</title>
      </Head>
      <Dashboard>
        <Heading as="h2" fontSize="xl" mb="2">
          Tambah Produk
        </Heading>
        <form onSubmit={formik.handleSubmit} onReset={formik.handleReset}>
          <VStack align="stretch">
            <FormControl
              id="nama"
              isInvalid={formik.touched.name && !!formik.errors.name}
            >
              <FormLabel>Nama</FormLabel>
              <Input
                type="text"
                size="lg"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Mobile Legends"
              />
              <FormErrorMessage>{formik.errors.name}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="tipe"
              isInvalid={formik.touched.type && !!formik.errors.type}
            >
              <FormLabel>Tipe</FormLabel>
              <Select
                name="type"
                value={formik.values.type}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                placeholder="Tipe produk"
                size="lg"
              >
                {Object.values(ProductType).map((name) => (
                  <option value={name} key={name}>
                    {name}
                  </option>
                ))}
              </Select>
              <FormErrorMessage>{formik.errors.type}</FormErrorMessage>
            </FormControl>
            {formik.values.type === ProductType.CASH && (
              <>
                <FormControl
                  id="namaId"
                  isInvalid={
                    formik.touched.primaryFormName &&
                    !!formik.errors.primaryFormName
                  }
                >
                  <FormLabel>Nama Id</FormLabel>
                  <Input
                    type="text"
                    name="primaryFormName"
                    value={formik.values.primaryFormName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    placeholder="User Id"
                  />
                  <FormErrorMessage>
                    {formik.errors.primaryFormName}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="namaIdTambahan"
                  isInvalid={
                    formik.touched.secondaryFormName &&
                    !!formik.errors.secondaryFormName
                  }
                >
                  <FormLabel>Nama Id Tambahan</FormLabel>
                  <Input
                    type="text"
                    name="secondaryFormName"
                    value={formik.values.secondaryFormName}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    placeholder="Zone Id"
                  />
                  <FormErrorMessage>
                    {formik.errors.secondaryFormName}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}
            <FormControl
              id="urlThumbnail"
              isInvalid={formik.touched.image && !!formik.errors.image}
            >
              <FormLabel>URL Thumbnail</FormLabel>
              <Input
                type="text"
                name="image"
                value={formik.values.image}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                placeholder="http://gambar.com/gambar.jpg"
              />
              <FormErrorMessage>{formik.errors.image}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="urlBanner"
              isInvalid={formik.touched.banner && !!formik.errors.banner}
            >
              <FormLabel>URL Banner</FormLabel>
              <Input
                type="text"
                name="banner"
                value={formik.values.banner}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                placeholder="http://gambar.com/banner.jpg"
              />
              <FormErrorMessage>{formik.errors.banner}</FormErrorMessage>
            </FormControl>
            <FormControl
              id="deskripsi"
              isInvalid={
                formik.touched.description && !!formik.errors.description
              }
            >
              <FormLabel>Deskripsi</FormLabel>
              <Textarea
                type="text"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                size="lg"
                rows={5}
                placeholder="Top up ML Diamond hanya dalam hitungan detik! Cukup masukan Username MLBB Anda, pilih jumlah Diamond yang Anda inginkan, selesaikan pembayaran..."
              />
              <FormErrorMessage>{formik.errors.description}</FormErrorMessage>
            </FormControl>

            {formik.values.type === ProductType.CASH && (
              <>
                <FormControl
                  id="tipMencariId"
                  isInvalid={
                    formik.touched.helperText && !!formik.errors.helperText
                  }
                >
                  <FormLabel>Tip Mencari Id</FormLabel>
                  <Textarea
                    type="text"
                    name="helperText"
                    value={formik.values.helperText}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    rows={3}
                    placeholder="Top up ML Diamond hanya dalam hitungan detik! Cukup masukan Username MLBB Anda, pilih jumlah Diamond yang Anda inginkan, selesaikan pembayaran..."
                  />
                  <FormErrorMessage>
                    {formik.errors.helperText}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  id="urlGambarTipMencariId"
                  isInvalid={
                    formik.touched.helperImage && !!formik.errors.helperImage
                  }
                >
                  <FormLabel>URL Gambar Tip Mencari Id</FormLabel>
                  <Input
                    type="text"
                    name="helperImage"
                    value={formik.values.helperImage}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    size="lg"
                    placeholder="http://gambar.com/gambar.jpg"
                  />
                  <FormErrorMessage>
                    {formik.errors.helperImage}
                  </FormErrorMessage>
                </FormControl>
              </>
            )}
            <Heading as="h3" fontSize="xl">
              Items
            </Heading>
            {formik.values.items.map((item, index) => {
              return (
                <Box key={item.identity}>
                  <Heading as="h4" fontSize="lg" pt="2">
                    Item #{index + 1}
                  </Heading>
                  <FormControl
                    id={`namaItem[${index}]`}
                    isInvalid={(() => {
                      const errors = formik.errors.items as
                        | FormikErrors<ItemValues>[]
                        | undefined;

                      if (
                        formik.touched.items &&
                        formik.touched.items[index] &&
                        formik.touched.items[index].value &&
                        errors &&
                        errors[index] &&
                        !!errors[index].value
                      )
                        return true;
                      return undefined;
                    })()}
                  >
                    <FormLabel>Nama Item</FormLabel>
                    <Input
                      type="text"
                      name={`items[${index}].value`}
                      value={formik.values.items[index].value}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="3 Diamonds"
                      size="lg"
                    />
                    <FormErrorMessage>
                      {formik.errors.items &&
                        (formik.errors.items as FormikErrors<ItemValues>[])[
                          index
                        ] &&
                        (formik.errors.items as FormikErrors<ItemValues>[])[
                          index
                        ].value}
                    </FormErrorMessage>
                  </FormControl>
                  <FormControl
                    id={`hargaItem[${index}]`}
                    isInvalid={(() => {
                      const errors = formik.errors.items as
                        | FormikErrors<ItemValues>[]
                        | undefined;

                      if (
                        formik.touched.items &&
                        formik.touched.items[index] &&
                        formik.touched.items[index].price &&
                        errors &&
                        errors[index] &&
                        !!errors[index].price
                      )
                        return true;
                      return undefined;
                    })()}
                  >
                    <FormLabel>Harga Item</FormLabel>
                    <Input
                      type="number"
                      name={`items[${index}].price`}
                      value={formik.values.items[index].price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      size="lg"
                    />
                    <FormErrorMessage>
                      {formik.errors.items &&
                        (formik.errors.items as FormikErrors<ItemValues>[])[
                          index
                        ] &&
                        (formik.errors.items as FormikErrors<ItemValues>[])[
                          index
                        ].price}
                    </FormErrorMessage>
                  </FormControl>
                  <ButtonGroup mt="2">
                    <Button
                      type="button"
                      onClick={() => {
                        formik.setValues((values) => {
                          const items = [...values.items];

                          items.splice(index + 1, 0, {
                            identity: identity + 1,
                            value: '',
                            price: 0,
                          });

                          return {
                            ...values,
                            items,
                          };
                        });

                        setIdentity((state) => state + 1);
                      }}
                      colorScheme="green"
                    >
                      Tambah Item
                    </Button>
                    {formik.values.items.length > 1 && (
                      <Button
                        colorScheme="red"
                        onClick={() => {
                          formik.setValues((values) => {
                            return {
                              ...values,
                              items: values.items.filter(
                                (itm) => itm.identity !== item.identity
                              ),
                            };
                          });
                        }}
                      >
                        Hapus Item
                      </Button>
                    )}
                  </ButtonGroup>
                </Box>
              );
            })}
            <Button
              type="submit"
              isLoading={uploadingProduct}
              colorScheme="yellow"
              size="lg"
              isFullWidth
            >
              Edit Produk
            </Button>
            <Button
              type="button"
              isLoading={uploadingProduct}
              colorScheme="red"
              size="lg"
              isFullWidth
              onClick={() => setIsDeleted(true)}
            >
              Hapus Produk
            </Button>
          </VStack>
        </form>
      </Dashboard>
      <AlertDialog
        isOpen={isFailed || isSuccess || isDeleted}
        leastDestructiveRef={cancelRef}
        onClose={() => {
          if (isSuccess) setIsSuccess(false);
          if (isFailed) setIsFailed(false);
          if (isDeleted) setIsDeleted(false);
        }}
        size="lg"
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {isSuccess
                ? 'Berhasil'
                : isFailed
                ? 'Gagal'
                : 'Apakah anda yakin ingin menghapus produk ini?'}
            </AlertDialogHeader>
            <AlertDialogBody>
              {isSuccess
                ? 'Produk berhasil diubah'
                : isFailed
                ? 'Produk gagal diubah, silahkan coba lagi'
                : 'Anda tidak bisa mengembalikan produk yang telah dihapus, pastikan anda benar-benar yakin ingin menghapusnya'}
            </AlertDialogBody>
            <AlertDialogFooter>
              <ButtonGroup>
                <Button
                  ref={cancelRef}
                  onClick={() => {
                    if (isSuccess) setIsSuccess(false);
                    if (isFailed) setIsFailed(false);
                    if (isDeleted) setIsDeleted(false);
                  }}
                >
                  Tutup
                </Button>
                {isDeleted && (
                  <Button
                    ref={cancelRef}
                    colorScheme="red"
                    onClick={() => {
                      editProduct({
                        variables: { id, deleted: true },
                        refetchQueries: [
                          { query: ProductQuery, variables: { id } },
                          { query: ProductsQuery },
                        ],
                      });
                    }}
                  >
                    Hapus
                  </Button>
                )}
              </ButtonGroup>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </MainLayout>
  );
};

export default DashboardEditItem;
