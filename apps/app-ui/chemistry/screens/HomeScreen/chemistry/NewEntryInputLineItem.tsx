import React, { useEffect, useMemo, useState } from 'react';
import {
  Badge,
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spacer,
  Stack,
  StackProps,
  Switch,
  useColorModeValue,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react';
import ResizeTextarea from 'react-textarea-autosize';
import { useAppDispatch, useAppSelector } from '../../../../store';
import moment from 'moment';
import { useTimezone } from '../../../../hooks/useTimezone';
import { addEntry, uploadFile } from '../../../../store/actions/entries';
import { useWatchAsyncStatus } from '../../../../hooks/useWatchAsyncStatus';
import { AsyncStatus } from '../../../../store/types';
import { isEntryToday } from '../../../../services/models/entry';
import { useDropzone } from 'react-dropzone';
import { RiImageAddFill } from 'react-icons/ri';
import { AttachmentAspectBox } from './AttachmentAspectBox';
import { resetSelectedFiles, resetState } from '../../../../store/slices/screens/home';
import { DatePicker } from '../../../atoms/DatePicker';
import { LabeledField } from '../../../molecules/LabeledField';
import { useIsPremiumUser } from '../../../../hooks/useIsPremiumUser';

const maxCharacters = 100;
const premiumMaxCharacters = 2_000;

const MAX_SIZE_FILE_BYTES = 268_435_456; // 256 MiB
const MAX_NUM_IMAGES = 4;
const supportFileTypes: string[] = [
  'image/jpeg',
  'image/png',
  'video/mp4',
  'video/quicktime',
];

export const NewEntryInputLineItem = (props: StackProps) => {
  const isUserSubscribed = useIsPremiumUser();
  const {
    isOpen: isSendToTheFutureModalOpen,
    onOpen: onOpenSendToTheFutureModal,
    onClose: onCloseSendToTheFutureModal,
  } = useDisclosure();
  const timezone = useTimezone();
  const dispatch = useAppDispatch();
  const { addEntryStatus, entries } = useAppSelector((state) => state.entities);
  const { filesSelected, queuedFilesForEntry, pendingFilesForEntry } = useAppSelector(
    (state) => state.homeScreen,
  );
  const entryExistsToday = useMemo(
    () => entries.some((e) => isEntryToday(e, timezone)),
    [entries, timezone],
  );
  const entryDisabled = entryExistsToday && !isUserSubscribed;
  const selectedFiles = useMemo(() => {
    const files = [
      ...queuedFilesForEntry.map((f) => ({ ...f, pending: false })),
      ...pendingFilesForEntry.map((f) => ({
        ...f,
        pending: true,
      })),
    ];
    return files.sort(
      (a, b) => filesSelected.indexOf(b.identifier) - filesSelected.indexOf(a.identifier),
    );
  }, [queuedFilesForEntry, pendingFilesForEntry, filesSelected]);
  const numImages = useMemo(
    () => selectedFiles.filter((sf) => sf.type.startsWith('image/')).length,
    [selectedFiles],
  );
  const numVideos = useMemo(
    () => selectedFiles.filter((sf) => sf.type.startsWith('video/')).length,
    [selectedFiles],
  );
  const addFileDisabled = numVideos >= 1 || numImages >= MAX_NUM_IMAGES;
  const doUploadFile = (file: File) => {
    dispatch(
      uploadFile({
        file,
        url: URL.createObjectURL(file),
      }),
    )
      .unwrap()
      .catch(() => {});
  };
  const onDrop = (acceptedFiles: File[]) => {
    const existingFiles = [...pendingFilesForEntry, ...queuedFilesForEntry];
    const existingFileNames = existingFiles.map((ef) => ef.name);
    if (acceptedFiles.some((af) => existingFileNames.includes(af.name))) {
      toast({
        description: `File names cannot repeat`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    const allFiles = [...existingFiles, ...acceptedFiles];
    const newNumSelectedImages = allFiles.filter((f) =>
      f.type.startsWith('image/'),
    ).length;
    const newNumSelectedVideos = allFiles.filter((f) =>
      f.type.startsWith('video/'),
    ).length;
    if (
      newNumSelectedVideos > 1 ||
      (newNumSelectedVideos === 1 && newNumSelectedImages > 0) ||
      newNumSelectedImages > MAX_NUM_IMAGES
    ) {
      toast({
        title: `Too Many Files`,
        description: `Please only choose 1 video or up to ${MAX_NUM_IMAGES} images.`,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (acceptedFiles.some((af) => af.size > MAX_SIZE_FILE_BYTES)) {
      toast({
        description: 'Selected files must not be larger than 256 MB',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    } else if (acceptedFiles.some((af) => !supportFileTypes.includes(af.type))) {
      toast({
        title: 'Unsupported File Type',
        description: 'Images must be a .png or .jpeg & videos must be a .mp4 or .mov.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    for (const acceptedFile of acceptedFiles) {
      doUploadFile(acceptedFile);
    }
  };
  const { getRootProps, getInputProps, open } = useDropzone({
    noClick: true,
    noKeyboard: true,
    noDrag: true,
    accept: {
      'image/*': ['.png', '.jpeg', '.jpg'],
      'video/*': ['.mp4'],
    },
    onDrop,
  });

  const maxCharactersForUser = useMemo(
    () => (isUserSubscribed ? premiumMaxCharacters : maxCharacters),
    [isUserSubscribed],
  );
  const [isPublic, setIsPublic] = useState(false);
  const [isTimeLocked, setIsTimeLocked] = useState(false);
  const [selectedTimeLockDate, setSelectedTimeLockDate] = useState<Date | null>(null);
  const [content, setContent] = useState('');
  const isFormValid = content.length > 0;

  const onSave = () => {
    if (content.length > 0) {
      dispatch(
        addEntry({
          date: moment().format(),
          content,
          isPublic,
          media: queuedFilesForEntry.map((sf) => sf.key),
          timeLockDate:
            selectedTimeLockDate != null ? moment(selectedTimeLockDate).format() : null,
        }),
      );
    }
  };
  const saving = addEntryStatus === AsyncStatus.PENDING;

  const toast = useToast();
  useWatchAsyncStatus(addEntryStatus, {
    onSuccess: () => {
      toast({
        title: 'Entry Saved',
        description: 'Your new entry saved successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      setContent('');
      dispatch(resetSelectedFiles());
      setIsPublic(false);
      setIsTimeLocked(false);
      setSelectedTimeLockDate(null);
      onCloseSendToTheFutureModal();
    },
  });

  useEffect(() => {
    return () => {
      dispatch(resetState());
    };
  }, []);

  const submitDisabled =
    !isFormValid || saving || entryDisabled || pendingFilesForEntry.length > 0;

  return (
    <>
      <VStack alignItems={'start'} {...props}>
        <Flex w={'100%'} alignItems={'end'}>
          <Heading as={'h2'} size={'md'}>
            Message for Today
          </Heading>
          <Spacer />
          <Box as={'span'} px={2} fontSize={'0.8rem'}>
            {`${content.length} / ${maxCharactersForUser}`}
          </Box>
        </Flex>
        <AutoResizeInput
          value={content}
          maxCharacters={maxCharactersForUser}
          onChange={setContent}
          isDisabled={entryDisabled}
        />
        {selectedFiles.length > 0 && (
          <SimpleGrid
            w={'100%'}
            columns={
              numVideos === 0
                ? {
                    base: 2,
                    md: 5,
                  }
                : undefined
            }
            gridTemplateColumns={numVideos !== 0 ? 'minmax(auto, 600px)' : undefined}
            gap={4}
          >
            {selectedFiles.map((f) => (
              <AttachmentAspectBox key={f.identifier} file={f} />
            ))}
          </SimpleGrid>
        )}
        <Flex gap={4} justifyContent={'space-between'} w={'100%'}>
          <Box {...getRootProps({ className: 'dropzone' })}>
            <IconButton
              aria-label={'Attach an Image or Video'}
              icon={<RiImageAddFill />}
              onClick={open}
              isDisabled={addFileDisabled || entryDisabled}
            />
            <input {...getInputProps()} />
          </Box>
          <Stack direction={'row'} gap={2}>
            <Flex alignItems={'center'} gap={2}>
              <Badge>Public</Badge>
              <Switch
                colorScheme={'brand'}
                isChecked={isPublic}
                onChange={() => setIsPublic(!isPublic)}
                isDisabled={entryDisabled}
              />
            </Flex>
            {isUserSubscribed && (
              <Flex alignItems={'center'} gap={2}>
                <Badge bg={'brand.500'} color={'white'}>
                  Time-locked
                </Badge>
                <Switch
                  colorScheme={'brand'}
                  isChecked={isTimeLocked}
                  onChange={() => setIsTimeLocked(!isTimeLocked)}
                  isDisabled={entryDisabled}
                />
              </Flex>
            )}
          </Stack>
        </Flex>
        <Flex justifyContent={'end'} w={'100%'}>
          <Stack direction={'row'} gap={2}>
            <Button
              isDisabled={submitDisabled}
              isLoading={saving && !isSendToTheFutureModalOpen}
              onClick={() => {
                if (isTimeLocked) {
                  onOpenSendToTheFutureModal();
                } else {
                  onSave();
                }
              }}
            >
              Submit
            </Button>
          </Stack>
        </Flex>
      </VStack>
      <Modal
        isOpen={isSendToTheFutureModalOpen}
        onClose={() => {
          onCloseSendToTheFutureModal();
          setSelectedTimeLockDate(null);
        }}
      >
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Time-lock Your Message</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack direction={'column'} gap={2}>
              <Box as={'p'}>
                Select the date you'd like for your message to be sent to:
              </Box>
              <LabeledField label={'Date'} htmlFor={'time-lock-date'} maxW={'10rem'}>
                <DatePicker
                  selectedDate={selectedTimeLockDate}
                  onChange={setSelectedTimeLockDate}
                  onClear={() => setSelectedTimeLockDate(null)}
                />
              </LabeledField>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button
              isDisabled={selectedTimeLockDate == null || submitDisabled}
              isLoading={saving}
              onClick={onSave}
            >
              Submit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

interface AutoResizeInputProps {
  value: string;
  maxCharacters: number;
  isDisabled: boolean;
  onChange: (newValue: string) => void;
}

const AutoResizeInput = React.forwardRef<HTMLInputElement, AutoResizeInputProps>(
  ({ value, maxCharacters, isDisabled, onChange }, ref) => (
    <Input
      ref={ref as any}
      p={'0.5rem'}
      focusBorderColor={useColorModeValue('gray.200', 'gray.200')}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      as={ResizeTextarea}
      minRows={2}
      resize={'none'}
      transition={'height none'}
      maxLength={maxCharacters}
      isDisabled={isDisabled}
    />
  ),
);
