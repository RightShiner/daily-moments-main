import React from 'react';
import { serialize } from 'next-mdx-remote/serialize';
import { GetStaticPaths, GetStaticProps } from 'next';
import gfm from 'remark-gfm';
import { ParsedUrlQuery } from 'querystring';
import { capitalize } from 'lodash';
import { LegalScreenProps, Screen } from '../../chemistry/screens/LegalScreen';
import { Seo } from '../../chemistry/molecules/Seo';
import { getLegalPolicyBySlug } from '../../services/legal';

interface PageProps extends LegalScreenProps {
  title: string;
}

const Page = ({ title, ...props }: PageProps) => (
  <>
    <Seo title={`${title} | Daily Moments`} />
    <Screen {...props} />
  </>
);

export default Page;

interface StaticPathsParams extends ParsedUrlQuery {
  policy: string;
}

const policies = ['data-deletion-policy', 'privacy-policy', 'terms-of-service'];

export const getStaticPaths: GetStaticPaths<StaticPathsParams> = async () => ({
  paths: policies.map((policy) => ({
    params: {
      policy,
    },
  })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<PageProps, StaticPathsParams> = async ({
  params,
}) => {
  const theContent = getLegalPolicyBySlug(params.policy);
  const mdx = await serialize(theContent, {
    mdxOptions: { remarkPlugins: [gfm as any] },
  });
  return {
    props: {
      title: params.policy
        .split('-')
        .map((c) => capitalize(c))
        .join(' '),
      mdx,
    },
  };
};
