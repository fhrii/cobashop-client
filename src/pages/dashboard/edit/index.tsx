import { useQuery } from '@apollo/client';
import {
  Box,
  Link as ChakraLink,
  SimpleGrid,
  Skeleton,
  StackDivider,
  Text,
  VStack,
} from '@chakra-ui/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { ProductType } from '../../../../__generated__/globalTypes';
import Dashboard from '../../../components/Dashboard';
import MainLayout from '../../../components/MainLayout';
import ProductsQuery from '../../../graphql/query/ProductsQuery';
import { Products } from '../../../graphql/query/__generated__/Products';

const DashboardEdit = () => {
  const { data, loading } = useQuery<Products>(ProductsQuery);

  if (!data || loading)
    return (
      <div>
        <SimpleGrid
          columns={{ base: 3, md: 4 }}
          spacing={{ base: 6, sm: 8, md: 10 }}
        >
          {new Array(8).fill(1).map((_, index) => (
            <Skeleton
              key={index}
              height={{ base: '5em', sm: '7em', md: '9em' }}
            />
          ))}
        </SimpleGrid>
      </div>
    );

  const cashProducts = data.products.filter(
    (product) => product.type === ProductType.CASH
  );

  const voucherProducts = data.products.filter(
    (product) => product.type === ProductType.VOUCHER
  );

  return (
    <MainLayout>
      <Head>
        <title>Ubah Produk - Cobashop</title>
      </Head>
      <Dashboard>
        <VStack
          divider={<StackDivider borderColor="gray.200" />}
          spacing={4}
          align="stretch"
        >
          {!cashProducts.length && !voucherProducts.length && (
            <Text fontSize="2xl" textAlign="center" py="10">
              Maaf kita belum ada pembayaran yang dapat kami dukung
            </Text>
          )}
          {cashProducts.length && (
            <Box>
              <SimpleGrid columns={{ base: 3, md: 4 }} spacing={10}>
                {cashProducts.map((product) => (
                  <Link
                    href={`/dashboard/edit/${product.id}`}
                    key={product.id}
                    passHref
                  >
                    <ChakraLink _hover={{ textDecoration: 'none' }}>
                      <Box>
                        <Box borderRadius="md" overflow="hidden">
                          <Image
                            src={product.image}
                            width={178}
                            height={178}
                            layout="responsive"
                          />
                        </Box>
                        <Text textAlign="center">{product.name}</Text>
                      </Box>
                    </ChakraLink>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>
          )}
          {voucherProducts.length && (
            <Box>
              <SimpleGrid columns={{ base: 3, md: 4 }} spacing={10}>
                {voucherProducts.map((product) => (
                  <Link
                    href={`/dashboard/edit/${product.id}`}
                    key={product.id}
                    passHref
                  >
                    <ChakraLink _hover={{ textDecoration: 'none' }}>
                      <Box>
                        <Box borderRadius="md" overflow="hidden">
                          <Image
                            src={product.image}
                            width={178}
                            height={178}
                            layout="responsive"
                          />
                        </Box>
                        <Text textAlign="center">{product.name}</Text>
                      </Box>
                    </ChakraLink>
                  </Link>
                ))}
              </SimpleGrid>
            </Box>
          )}
        </VStack>
      </Dashboard>
    </MainLayout>
  );
};

export default DashboardEdit;
