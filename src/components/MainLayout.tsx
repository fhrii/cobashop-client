import { Box, Container, Flex } from '@chakra-ui/react';
import { FC } from 'react';
import Footer from './Footer';
import Navbar from './Navbar';

const MainLayout: FC = ({ children }) => {
  return (
    <Flex flexDirection="column" minHeight="100vh">
      <Navbar />
      <Box flexGrow={1}>
        <Container maxW="4xl" py="2" boxSizing="border-box" flexGrow={1} mb="5">
          {children}
        </Container>
      </Box>
      <Footer />
    </Flex>
  );
};

export default MainLayout;
