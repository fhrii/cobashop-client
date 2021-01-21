import {
  Box,
  Container,
  Heading,
  ListItem,
  Text,
  UnorderedList,
} from '@chakra-ui/react';
const Footer = () => {
  return (
    <Box bg="gray.200" py="10">
      <Container maxW="4xl" textAlign="center">
        <Text>
          Aplikasi ini dibuat untuk memenuhi tugas akhir Praktek Pemrograman Web
        </Text>
        <Heading as="h4" fontSize="lg">
          Anggota Kelompok
        </Heading>
        <UnorderedList styleType="none">
          <ListItem>Aji Firmansyah (1803015157)</ListItem>
          <ListItem>Fahri AHmad Fachrudin (1803015069)</ListItem>
          <ListItem>Hamdhani Nurul Setiawan (1803015017)</ListItem>
          <ListItem>Izar Hairul Anam (1803015104)</ListItem>
          <ListItem>Hafifsyah Rifaldi (1803015221)</ListItem>
        </UnorderedList>
      </Container>
    </Box>
  );
};

export default Footer;
