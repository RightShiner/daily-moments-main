import React from 'react';
import { Box, Flex, IconButton, Progress, SimpleGrid, Spinner } from '@chakra-ui/react';
import { RiCloseCircleFill } from 'react-icons/ri';
import { AspectAttachedImage } from './AspectAttachedImage';
import { AspectAttachedVideo } from './AspectAttachedVideo';
import filesize from 'filesize';
import { removeFile, SelectedFile } from '../../../../store/slices/screens/home';
import { useAppDispatch } from '../../../../store';

interface Props {
  file: SelectedFile & { pending: boolean };
}

export const AttachmentAspectBox = ({ file }: Props) => {
  const isImage = file.type.startsWith('image/');

  return isImage ? (
    <SimpleGrid>
      <AspectAttachedImage
        src={file.url}
        alt={file.name}
        gridRow={'1 / span 1'}
        gridColumn={'1 / span 1'}
      />
      <RemoveFileIconButton identifier={file.identifier} />
      {file.pending && (
        <>
          <UploadingSpinner />
          <UploadProgress progress={file.uploadProgress} bytes={file.bytes} />
        </>
      )}
    </SimpleGrid>
  ) : (
    <SimpleGrid>
      <AspectAttachedVideo
        controls={!file.pending}
        src={file.url}
        gridRow={'1 / span 1'}
        gridColumn={'1 / span 1'}
      />
      <RemoveFileIconButton identifier={file.identifier} />
      {file.pending && (
        <>
          <UploadingSpinner />
          <UploadProgress progress={file.uploadProgress} bytes={file.bytes} />
        </>
      )}
    </SimpleGrid>
  );
};

interface RemoveFileIconButtonProps {
  identifier: string;
}

const RemoveFileIconButton = ({ identifier }: RemoveFileIconButtonProps) => {
  const dispatch = useAppDispatch();
  return (
    <IconButton
      gridRow={'1 / span 1'}
      gridColumn={'1 / span 1'}
      aria-label={'De-select image'}
      icon={<RiCloseCircleFill size={35} />}
      opacity={0.6}
      _hover={{ opacity: 0.8 }}
      placeSelf={'start'}
      w={'fit-content'}
      onClick={() => {
        dispatch(removeFile(identifier));
      }}
      m={1}
      variant={'ghost'}
    />
  );
};

const UploadingSpinner = () => (
  <Spinner
    gridRow={'1 / span 1'}
    gridColumn={'1 / span 1'}
    placeSelf={'center'}
    color={'coral.1100'}
    size={'xl'}
  />
);

const UploadProgress = ({ progress, bytes }: { progress: number; bytes: number }) => (
  <>
    <Progress
      gridRow={'1 / span 1'}
      gridColumn={'1 / span 1'}
      alignSelf={'end'}
      colorScheme={'coral-progress'}
      size={'lg'}
      hasStripe={true}
      value={progress * 100}
      w={'100%'}
      borderBottomLeftRadius={'lg'}
      borderBottomRightRadius={'lg'}
      bg={'black'}
    />
    <Flex
      color={'white'}
      gridRow={'1 / span 1'}
      gridColumn={'1 / span 1'}
      alignSelf={'end'}
      w={'100%'}
      justifyContent={'space-between'}
      zIndex={10}
      fontSize={'0.7rem'}
      px={1}
    >
      <Box as={'span'}>
        {
          filesize(bytes * progress, {
            round: 2,
            exponent: 2,
            output: 'object',
          }).value
        }{' '}
        / {filesize(bytes, { exponent: 2, round: 2 })}
      </Box>
      <Box as={'span'}>{(progress * 100).toFixed(1)}%</Box>
    </Flex>
  </>
);
