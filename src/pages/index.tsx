import Head from 'next/head';
import MainLayout from '../components/MainLayout';
import Products from '../components/Products';

const HomePage = () => {
  return (
    <MainLayout>
      <Head>
        <title>Cobashop</title>
      </Head>
      <Products />
    </MainLayout>
  );
};

export default HomePage;
