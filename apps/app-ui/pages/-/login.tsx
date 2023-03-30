import React from 'react';
import { Screen } from '../../chemistry/screens/LoginScreen';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Seo } from '../../chemistry/molecules/Seo';

const Page = () => (
  <>
    <Seo title={'Login - Daily Moments'} />
    <Screen />
  </>
);

export default Page;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session != null) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
