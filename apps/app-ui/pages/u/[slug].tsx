import React from 'react';
import { Screen } from '../../chemistry/screens/PublicPageScreen';
import { Seo } from '../../chemistry/molecules/Seo';
import { useRouter } from 'next/router';

const PublicPage = () => {
  const router = useRouter();
  const { slug } = router.query;
  return (
    <>
      <Seo />
      <Screen slug={slug as string} />
    </>
  );
};

export default PublicPage;
