import React, { useEffect } from 'react';
import { NegativeButton, PrimaryButton } from '@dm/chemistry';
import { useAppSelector } from '../../../../store';
import {
  Box,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Spinner,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { useAxiosGet } from '@dm/react/axios';
import { SubscriptionStatus } from '@dm/models';

export const ManageSubscriptionButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { userPreferences } = useAppSelector((state) => state.preferences);
  const {
    execute: fetchManageSubscriptionUrls,
    loading: fetchingManageSubscriptionUrls,
    data: manageSubscriptionUrls,
  } = useAxiosGet<{
    update: string | null;
    cancel: string | null;
  }>(`/v1/users/manage-subscription`);
  useEffect(() => {
    if (isOpen) {
      fetchManageSubscriptionUrls();
    }
  }, [isOpen]);

  return userPreferences.subscription?.status !== SubscriptionStatus.CANCELLED ? (
    <>
      <PrimaryButton justifySelf={'end'} onClick={onOpen}>
        Manage Subscription
      </PrimaryButton>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={2}>
          <ModalHeader>Manage Your Subscription</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack pb={3}>
              {fetchingManageSubscriptionUrls ? (
                <SimpleGrid py={8} justifyItems={'center'}>
                  <Spinner size='xl' />
                </SimpleGrid>
              ) : manageSubscriptionUrls?.update != null &&
                manageSubscriptionUrls?.cancel != null ? (
                <>
                  <Box as={'p'} pb={3} color={'gray.500'} fontSize={'sm'}>
                    Clicking either of the buttons below will take you to our payment
                    partner Paddle to manage or cancel your subscription:
                  </Box>
                  <PrimaryButton
                    onClick={() => {
                      window.open(manageSubscriptionUrls.update);
                    }}
                  >
                    Manage Subscription
                  </PrimaryButton>
                  <NegativeButton
                    onClick={() => {
                      window.open(manageSubscriptionUrls.cancel);
                    }}
                  >
                    Cancel Subscription
                  </NegativeButton>
                </>
              ) : (
                <Box as={'p'} pb={3} color={'gray.500'} fontSize={'sm'}>
                  An error occurred loading your subscription management console. Please
                  contact support.
                </Box>
              )}
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  ) : (
    <></>
  );
};
