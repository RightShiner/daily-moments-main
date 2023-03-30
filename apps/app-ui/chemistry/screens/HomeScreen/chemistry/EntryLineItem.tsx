import {
  Badge,
  Box,
  BoxProps,
  Flex,
  Heading,
  IconButton,
  useColorModeValue,
} from '@chakra-ui/react';
import React, { useMemo } from 'react';
import { AttachedFile, Entry } from '../../../../services/models/entry';
import moment from 'moment-timezone';
import { useTimezone } from '../../../../hooks/useTimezone';
import { EntryRowMedia } from './EntryRowMedia';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useAppSelector } from '../../../../store';

interface Props {
  index?: number;
  entry: Entry;
  onOpenImageCarousel: (images: AttachedFile[], selectedIndex: number) => void;
  isShownPublicly?: boolean;
}

export const EntryLineItem = ({
  index = 0,
  entry,
  onOpenImageCarousel,
  isShownPublicly = false,
}: Props) => {
  const timezone = useTimezone();
  const date = useMemo(() => moment.tz(entry.date, timezone), [entry, timezone]);
  const topBorderStyles: BoxProps = {
    borderTopStyle: 'solid',
    borderTopWidth: 'thin',
    borderTopColor: useColorModeValue('gray.200', 'gray.200'),
  };
  const hasAttachments = entry.media.images.length > 0 || entry.media.videos.length > 0;
  const userPreferences = useAppSelector((store) => store.preferences.userPreferences);
  const isCurrentUserTheAuthor =
    userPreferences != null && entry.author.userId === userPreferences.userId;

  return (
    <Box pt={index > 0 ? 6 : 0} pb={6} {...(index > 0 ? topBorderStyles : {})}>
      <Flex alignItems={'center'} gap={3} pb={1}>
        <Heading as={'h5'} fontWeight={'bold'} fontSize={{ base: 'xs', md: 'sm' }}>
          {date.format('M/D/YYYY')}
        </Heading>
        {!isShownPublicly && isCurrentUserTheAuthor && entry.isPublic ? (
          <Badge>Public</Badge>
        ) : (
          !isShownPublicly &&
          !isCurrentUserTheAuthor &&
          entry.author.slug && (
            <Badge bg={'brand.500'} color={'white'}>
              /u/{entry.author.slug}
            </Badge>
          )
        )}
      </Flex>
      <Flex
        alignSelf={'start'}
        pb={hasAttachments ? 3 : 0}
        fontSize={{ base: 'sm', md: 'md' }}
        gap={4}
      >
        <Box flexGrow={1}>{entry.content}</Box>
        {!isShownPublicly && !isCurrentUserTheAuthor && entry.author.slug && (
          <a href={`/u/${entry.author.slug}`} target={'_blank'}>
            <IconButton
              size={'sm'}
              icon={<FaExternalLinkAlt />}
              aria-label={"Visit author's public page"}
            />
          </a>
        )}
      </Flex>
      {isCurrentUserTheAuthor && hasAttachments && (
        <EntryRowMedia
          gridColumn={'1 / span 2'}
          gridRow={'3 / span 1'}
          e={entry}
          onOpenImageCarousel={onOpenImageCarousel}
        />
      )}
    </Box>
  );
};
