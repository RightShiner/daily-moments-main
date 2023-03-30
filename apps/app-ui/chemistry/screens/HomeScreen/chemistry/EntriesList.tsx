import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Collapse,
  Flex,
  Heading,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  SimpleGrid,
  Spinner,
} from '@chakra-ui/react';
import { EntryLineItem } from './EntryLineItem';
import { AiFillFilter, AiOutlineClose } from 'react-icons/ai';
import { LabeledField } from '../../../molecules/LabeledField';
import { DatePicker } from '../../../atoms/DatePicker';
import { useFetchEntries } from '../../../../store/actions/entries';
import { debounce } from 'lodash';
import { MdClear } from 'react-icons/md';
import { useAppDispatch } from '../../../../store';
import { clearEntries } from '../../../../store/slices/entities';
import { AttachedFile } from '../../../../services/models/entry';
import { ImageCarouselModal } from './ImageCarouselModal';

const debounceTime = 500;
const maxWait = 4000;

export const EntriesList: React.FC<{
  selectedFromDate: Date | null;
  setSelectedFromDate: (newDate: Date | null) => void;
  selectedToDate: Date | null;
  setSelectedToDate: (newDate: Date | null) => void;
}> = ({ selectedFromDate, selectedToDate, setSelectedFromDate, setSelectedToDate }) => {
  const [filterEntries, setFilterEntries] = useState(false);
  const [keyword, setKeyword] = useState<string | null>(null);

  const { entriesData, execute, pageIndex, setPageIndex, loading } = useFetchEntries();
  const debounceExecute = useMemo(() => {
    return debounce(
      (
        debPageIndex: number,
        debKeyword: string,
        fromDate: Date | null,
        toDate: Date | null,
      ) =>
        execute(debPageIndex, {
          keyword: debKeyword,
          date_on_after: fromDate,
          date_on_before: toDate,
        }),
      debounceTime,
      {
        maxWait,
      },
    );
  }, [execute]);
  useEffect(() => {
    debounceExecute(pageIndex, keyword, selectedFromDate, selectedToDate);
  }, [debounceExecute, pageIndex, keyword, selectedFromDate, selectedToDate]);

  const dispatch = useAppDispatch();
  useEffect(() => {
    return () => {
      dispatch(clearEntries());
    };
  }, [dispatch]);

  const [zoomedImageIndex, setZoomedImageIndex] = useState(0);
  const [zoomedImages, setZoomedImages] = useState<AttachedFile[]>(null);

  return (
    <>
      <Flex justifyContent={'space-between'} alignItems={'center'} pb={4}>
        <Heading as={'h3'} fontSize={'md'}>
          Entries
        </Heading>
        {!filterEntries ? (
          <IconButton
            aria-label={'Filter Entries'}
            onClick={() => setFilterEntries(true)}
            icon={<AiFillFilter />}
          />
        ) : (
          <IconButton
            aria-label={'Close Entry Filters'}
            onClick={() => {
              setFilterEntries(false);
              setSelectedFromDate(null);
              setSelectedToDate(null);
              setKeyword(null);
            }}
            icon={<AiOutlineClose />}
          />
        )}
      </Flex>
      <Collapse in={filterEntries} animateOpacity>
        <HStack pb={4}>
          <LabeledField label={'Keyword'} htmlFor={'keyword'} maxW={'16rem'}>
            <InputGroup size={'sm'}>
              <Input
                size={'sm'}
                value={keyword != null ? keyword : ''}
                onChange={(e) => {
                  setKeyword(e.target.value.length > 0 ? e.target.value : null);
                  setPageIndex(0);
                }}
                pr={'2.5rem'}
              />
              {keyword && (
                <InputRightElement width={'2.5rem'}>
                  <IconButton
                    variant={'ghost'}
                    h={'1.5rem'}
                    size={'sm'}
                    onClick={() => setKeyword(null)}
                    px={0}
                    aria-label={'Clear Keyword Input'}
                    icon={<MdClear />}
                  />
                </InputRightElement>
              )}
            </InputGroup>
          </LabeledField>
          <LabeledField label={'From Date'} htmlFor={'from-date'} maxW={'10rem'}>
            <DatePicker
              selectedDate={selectedFromDate}
              onChange={(date) => {
                setSelectedFromDate(date);
                setPageIndex(0);
              }}
              onClear={() => setSelectedFromDate(null)}
            />
          </LabeledField>
          <LabeledField label={'To Date'} htmlFor={'to-date'} maxW={'10rem'}>
            <DatePicker
              selectedDate={selectedToDate}
              onChange={(date) => {
                setSelectedToDate(date);
                setPageIndex(0);
              }}
              onClear={() => setSelectedToDate(null)}
            />
          </LabeledField>
        </HStack>
      </Collapse>
      {loading && entriesData.length === 0 ? (
        <SimpleGrid py={4} justifyItems={'center'}>
          <Spinner size='xl' />
        </SimpleGrid>
      ) : entriesData.length > 0 ? (
        entriesData.map((e, i) => (
          <EntryLineItem
            key={e.id}
            index={i}
            entry={e}
            onOpenImageCarousel={(images, selectedIndex) => {
              setZoomedImages(images);
              setZoomedImageIndex(selectedIndex);
            }}
          />
        ))
      ) : (
        <Box as={'p'} textAlign={'center'} color={'gray.400'} pt={8}>
          No entries found!
        </Box>
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
    </>
  );
};
