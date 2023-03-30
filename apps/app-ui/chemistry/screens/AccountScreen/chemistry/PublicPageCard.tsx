import React, { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Divider,
  Flex,
  Heading,
  Input,
  Stack,
  Switch,
  useToast,
} from '@chakra-ui/react';
import { PrimaryButton } from '@dm/chemistry';
import { Card } from '../../../molecules/Card';
import { useAppDispatch, useAppSelector } from '../../../../store';
import { updatePage, useFetchUserPublicPage } from '../../../../store/actions/pages';
import { AsyncStatus } from '../../../../store/types';
import { useWatchAsyncStatus } from '../../../../hooks/useWatchAsyncStatus';

export const PublicPageCard = () => {
  const { page } = useFetchUserPublicPage();
  return page != null && <InnerPublicPageCard />;
};

const InnerPublicPageCard = () => {
  const toast = useToast();
  const { userPage, updatePageStatus, updateErrors } = useAppSelector(
    (state) => state.page,
  );
  const [enabled, setEnabled] = useState<boolean>(userPage?.enabled ?? false);
  const [slug, setSlug] = useState<string>(userPage?.slug ?? '');

  const inputAcceptable = useMemo(() => {
    return slug.length > 0;
  }, [slug]);
  const inputIsDirty = enabled !== userPage.enabled || slug !== userPage.slug;

  const dispatch = useAppDispatch();
  const onSave = useCallback(() => {
    dispatch(updatePage({ enabled, slug: normalizeSlug(slug) }));
  }, [dispatch, enabled, slug]);
  const isSubmitting = updatePageStatus === AsyncStatus.PENDING;
  useWatchAsyncStatus(updatePageStatus, {
    onSuccess: () => {
      toast({
        title: 'Settings Saved',
        description: 'Your public profile settings have been saved successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    },
    onFailure: () => {
      toast({
        title: 'Error',
        description:
          updateErrors != null
            ? updateErrors.join('\n')
            : 'An error was encountered whiling saving your settings. Please try again or contact support.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    },
  });

  return (
    <Card>
      <Box p={6}>
        <Heading as={'h2'} fontSize={'xl'}>
          Public Profile Settings
        </Heading>
        <Box as={'p'} pb={6} color={'gray.500'} fontSize={'sm'}>
          Update your public profile settings.
        </Box>
        <Stack gap={4}>
          <Box>
            <Heading as={'h3'} fontSize={'xl'} pb={2}>
              Enabled
            </Heading>
            <Switch
              size={'lg'}
              isChecked={enabled}
              onChange={() => setEnabled(!enabled)}
            />
          </Box>
          <Box>
            <Heading as={'h3'} fontSize={'xl'} pb={2}>
              Slug
            </Heading>
            <Input
              disabled={isSubmitting}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            {slug.length > 0 && (
              <Box pt={2}>
                <Box as={'span'} fontWeight={'bold'}>
                  Your Profile URL:{' '}
                </Box>
                <Box as={'span'}>{`https://app.dailymoments.io/u/${normalizeSlug(
                  slug,
                )}`}</Box>
              </Box>
            )}
          </Box>
        </Stack>
      </Box>
      <Divider />
      <Flex px={6} py={3} justifyContent={'flex-end'} bg={'gray.50'}>
        <PrimaryButton
          isLoading={isSubmitting}
          isDisabled={isSubmitting || !inputAcceptable || !inputIsDirty}
          onClick={onSave}
        >
          Save
        </PrimaryButton>
      </Flex>
    </Card>
  );
};

const normalizeSlug = (rawSlug: string) => rawSlug.replace(new RegExp(' ', 'g'), '-');
