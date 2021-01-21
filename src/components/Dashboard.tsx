import {
  Box,
  Flex,
  Heading,
  Link as ChakraLink,
  SkeletonText,
  Text,
  VStack,
} from '@chakra-ui/react';
import Link from 'next/link';
import { FC } from 'react';
import { UserRole } from '../../__generated__/globalTypes';
import { useAuth } from '../context/AuthProvider';

const DashboardLink: FC<{ href: string }> = ({ children, href }) => (
  <Link href={href} passHref>
    <ChakraLink px="2" borderRadius="md" _hover={{ bg: 'gray.100' }}>
      <Text>{children}</Text>
    </ChakraLink>
  </Link>
);

const Dashboard: FC = ({ children }) => {
  const { isAuth, user } = useAuth();

  if (!isAuth || !user)
    return (
      <Flex>
        <Box flexBasis="10em" mr="4">
          <VStack align="stretch">
            <SkeletonText />
          </VStack>
        </Box>
        <Box flexGrow={1}>{children}</Box>
      </Flex>
    );

  return (
    <Flex>
      <Box flexBasis="10em" mr="4">
        <VStack align="stretch">
          <Heading as="h2" fontSize="lg">
            Dashboard
          </Heading>
          <DashboardLink href="/dashboard/">Transaksi</DashboardLink>
          {user && user.role === UserRole.ADMIN && (
            <>
              <DashboardLink href="/dashboard/transactions">
                Semua Transaksi
              </DashboardLink>
              <DashboardLink href="/dashboard/add">Tambah Produk</DashboardLink>
              <DashboardLink href="/dashboard/edit">Edit Produk</DashboardLink>
            </>
          )}
        </VStack>
      </Box>
      <Box flexGrow={1}>{children}</Box>
    </Flex>
  );
};

export default Dashboard;
