import React from 'react';
import styles from './Markdown.module.scss';
import Link from 'next/link';
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import { Box, BoxProps, Img } from '@chakra-ui/react';

const CustomLink = ({
  href,
  children,
  target,
  title,
}: {
  href: string;
  children: React.ReactFragment;
  target?: string;
  title?: string;
}) => (
  <Link href={href}>
    <a title={title} target={target}>
      {children}
    </a>
  </Link>
);

const components = {
  a: CustomLink,
  img: ({
    src,
    alt,
    title,
    height,
    width,
  }: {
    src: string;
    alt?: string;
    title?: string;
    height?: number;
    width?: number;
  }) => (
    <Img
      className={styles['img']}
      src={src}
      alt={alt}
      title={title}
      height={height}
      width={width}
      loading={'lazy'}
      borderRadius={4}
    />
  ),
  Img,
};

interface MdxProps {
  mdx: MDXRemoteSerializeResult;
}

export const Mdx = ({ mdx, ...props }: MdxProps & BoxProps) => (
  <Box className={styles['markdown']} {...props}>
    <MDXRemote {...mdx} components={components as any} />
  </Box>
);
