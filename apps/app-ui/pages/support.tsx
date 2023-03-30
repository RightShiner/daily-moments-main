import React from 'react';
import { Screen } from '../chemistry/screens/SupportScreen';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { Seo } from '../chemistry/molecules/Seo';

const Support = () => (
  <>
    <Seo title={'Support - Daily Moments'} />
    <Screen />
  </>
);

export default Support;

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
