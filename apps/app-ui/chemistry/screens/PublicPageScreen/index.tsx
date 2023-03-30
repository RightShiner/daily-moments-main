import React, { useCallback, useEffect, useState } from 'react';
import {
  Box,
  Button,
  Flex,
  Heading,
  SimpleGrid,
  Spinner,
  Stack,
  useToast,
} from '@chakra-ui/react';
import { useFetchPublicEntries } from '../../../store/actions/entries';
import { EntryLineItem } from '../HomeScreen/chemistry/EntryLineItem';
import { useFetchPublicPage } from '../../../store/actions/pages';
import { useAppDispatch, useAppSelector } from '../../../store';
import { clearEntries } from '../../../store/slices/entities';
import { setPublicPage } from '../../../store/slices/page';
import { AttachedFile } from '../../../services/models/entry';
import { ImageCarouselModal } from '../HomeScreen/chemistry/ImageCarouselModal';
import { AiOutlinePlus } from 'react-icons/ai';
import { useUser } from '../../../hooks/useUser';
import {
  fetchUserPreferences,
  followPage,
  stopFollowingPage,
} from '../../../store/actions/users.actions';

export const Screen: React.FC<{ slug: string }> = ({ slug }) => {
  const { page, loading: loadingPage, invalidSlug } = useFetchPublicPage(slug);
  const {
    entriesData,
    execute,
    pageIndex,
    loading: loadingEntries,
  } = useFetchPublicEntries(slug);
  useEffect(() => {
    execute(pageIndex);
  }, [execute, pageIndex]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearEntries());
      dispatch(setPublicPage(null));
    };
  }, [dispatch]);

  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);
  const [zoomedImages, setZoomedImages] = useState<AttachedFile[]>(null);

  const user = useUser();
  useEffect(() => {
    if (user != null) {
      dispatch(fetchUserPreferences());
    }
  }, [user, dispatch]);
  const toast = useToast();
  const userPreferences = useAppSelector((state) => state.preferences.userPreferences);
  const isUserFollowingThisPage =
    userPreferences != null &&
    page != null &&
    userPreferences.following.includes(page.userId);

  const [loadingFollowing, setLoadingFollowing] = useState(false);
  const onFollowPage = useCallback(() => {
    if (page != null) {
      setLoadingFollowing(true);
      dispatch(followPage(page.userId))
        .unwrap()
        .then(() => {
          setLoadingFollowing(false);
          dispatch(fetchUserPreferences());
          toast({
            title: 'Page Followed',
            description: `You have successfully followed ${page.name}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        })
        .catch(() => {
          setLoadingFollowing(false);
          toast({
            title: 'Error',
            description: `An error occurred following ${page.name}. Please try again.`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  }, [page, dispatch, toast]);
  const onStopFollowingPage = useCallback(() => {
    if (page != null) {
      setLoadingFollowing(true);
      dispatch(stopFollowingPage(page.userId))
        .unwrap()
        .then(() => {
          setLoadingFollowing(false);
          dispatch(fetchUserPreferences());
          toast({
            title: 'Page Un-followed',
            description: `You have successfully un-followed ${page.name}`,
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
        })
        .catch(() => {
          setLoadingFollowing(false);
          toast({
            title: 'Error',
            description: `An error occurred un-following ${page.name}. Please try again.`,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  }, [page, dispatch, toast]);

  return (
    <Box
      maxW={{ md: '5xl' }}
      gap={6}
      mx={'auto'}
      px={{ base: 4, md: 8 }}
      py={{ md: 4 }}
      w={'100%'}
    >
      {loadingPage || loadingEntries || (page == null && !invalidSlug) ? (
        <SimpleGrid py={4} justifyItems={'center'}>
          <Spinner size='xl' />
        </SimpleGrid>
      ) : invalidSlug ? (
        <Heading as={'h1'} fontSize={{ base: '2xl', md: '3xl' }} textAlign={'center'}>
          Public Page Not Found:
          <br />
          Check the URL you entered to try again
        </Heading>
      ) : (
        <Stack gap={{ base: 2, lg: 10 }}>
          <Stack gap={2}>
            <Heading as={'h1'} fontSize={{ base: '2xl', md: '4xl' }}>
              {page?.name != null && page.name.length > 0
                ? `${page.name}'s Daily Moments`
                : 'Daily Moments'}
            </Heading>
            {user != null &&
              page != null &&
              userPreferences != null &&
              userPreferences.userId !== page.userId && (
                <Flex>
                  {isUserFollowingThisPage ? (
                    <Button
                      size={'sm'}
                      onClick={onStopFollowingPage}
                      isDisabled={loadingFollowing}
                      isLoading={loadingFollowing}
                    >
                      Un-Follow {page.name}
                    </Button>
                  ) : (
                    <Button
                      leftIcon={<AiOutlinePlus />}
                      size={'sm'}
                      onClick={onFollowPage}
                      isDisabled={loadingFollowing}
                      isLoading={loadingFollowing}
                    >
                      Follow {page.name}
                    </Button>
                  )}
                </Flex>
              )}
          </Stack>
          <Stack>
            {entriesData.length > 0 ? (
              entriesData.map((e, i) => (
                <EntryLineItem
                  key={e.id}
                  index={i}
                  entry={e}
                  onOpenImageCarousel={(images, selectedIndex) => {
                    setZoomedImages(images);
                    setZoomedImageIndex(selectedIndex);
                  }}
                  isShownPublicly={true}
                />
              ))
            ) : (
              <Box as={'p'} color={'gray.400'}>
                No Entries Yet!
              </Box>
            )}
          </Stack>
        </Stack>
      )}
      {zoomedImages != null && (
        <ImageCarouselModal
          currentIndex={zoomedImageIndex}
          images={zoomedImages}
          onClose={() => {
            setZoomedImageIndex(0);
            setZoomedImages(null);
          }}
        />
      )}
    </Box>
  );
};
