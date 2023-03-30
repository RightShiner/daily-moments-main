import React from 'react';
import { Screen } from '../chemistry/screens/AccountScreen';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Seo } from '../chemistry/molecules/Seo';

const Account = () => (
  <>
    <Seo title={'Account - Daily Moments'} />
    <Screen />
  </>
);

export default Account;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session == null) {
    return {
      redirect: {
        destination: '/-/login',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};
