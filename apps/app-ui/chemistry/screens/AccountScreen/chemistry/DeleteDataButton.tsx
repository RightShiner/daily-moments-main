import React, { useCallback } from 'react';
import { NegativeButton } from '@dm/chemistry';
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { deleteUserdata } from '../../../../store/actions/users.actions';
import { AsyncStatus } from '../../../../store/types';
import { useWatchAsyncStatus } from '../../../../hooks/useWatchAsyncStatus';

export const DeleteDataButton = () => {
  const toast = useToast();
  const { deleteUserDataStatus } = useAppSelector((state) => state.preferences);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const dispatch = useAppDispatch();
  const onConfirmDeleteData = useCallback(() => {
    dispatch(deleteUserdata({}));
  }, [dispatch]);
  const isSubmitting = deleteUserDataStatus === AsyncStatus.PENDING;
  useWatchAsyncStatus(deleteUserDataStatus, {
    onSuccess: () => {
      onClose();
    },
    onFailure: () => {
      toast({
        title: 'Error',
        description:
          'An error was encountered whiling deleting your journal data. Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <>
      <NegativeButton justifySelf={'end'} onClick={onOpen}>
        Delete Your Data
      </NegativeButton>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Your Data</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to permanently delete your journal data? This cannot be
            undone later.
          </ModalBody>

          <ModalFooter>
            <NegativeButton
              onClick={onConfirmDeleteData}
              isLoading={isSubmitting}
              isDisabled={isSubmitting}
            >
              Delete Data
            </NegativeButton>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
