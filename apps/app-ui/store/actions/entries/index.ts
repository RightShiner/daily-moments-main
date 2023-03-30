import { RootState, useAppDispatch, useAppSelector } from '../../index';
import { useCallback, useEffect, useState } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as entriesApi from '../../../services/EntryService';
import * as entriesService from '../../../services/EntryService';
import { CreateEntryPayload, UpdateEntryPayload } from '../../../services/EntryService';
import { Entry } from '../../../services/models/entry';
import { fetchUserStats } from '../stats.actions';
import { AsyncStatus } from '../../types';
import moment from 'moment';
import { FileUploadPresignedUrlResponse } from './models';
import axios from 'axios';
import { updateFileUploadProgress } from '../../slices/screens/home';

export const fetchEntries = createAsyncThunk(
  'entries/fetchEntries',
  async (payload: {
    pageSize: number;
    skip: number;
    keyword: string | null;
    date_on_after: Date | null;
    date_on_before: Date | null;
  }) =>
    entriesApi.getPagedEntries(payload.skip, payload.pageSize, {
      keyword: payload.keyword ?? undefined,
      date_on_after:
        payload.date_on_after != null
          ? moment(payload.date_on_after).format('M-D-YYYY')
          : undefined,
      date_on_before:
        payload.date_on_before != null
          ? moment(payload.date_on_before).format('M-D-YYYY')
          : undefined,
    }),
);
export const useFetchEntries = (options: { pageSize?: number } = {}) => {
  const { pageSize = 15 } = options;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const execute = useCallback(
    (
      page: number,
      {
        keyword,
        date_on_after,
        date_on_before,
      }: {
        keyword: string | null;
        date_on_after: Date | null;
        date_on_before: Date | null;
      },
    ) => {
      setLoading(true);
      dispatch(
        fetchEntries({
          pageSize,
          skip: page * pageSize,
          keyword,
          date_on_after,
          date_on_before,
        }),
      )
        .unwrap()
        .then((result) => {
          setLoading(false);
          setIsMore(result.results.length === pageSize);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [dispatch, pageSize],
  );
  const entriesData = useAppSelector((state) => state.entities.entries);
  const [pageIndex, setPageIndex] = useState(0);
  return {
    loading,
    pageIndex,
    setPageIndex,
    isMore,
    entriesData,
    execute,
  };
};

export const fetchPublicEntries = createAsyncThunk(
  'entries/fetchPublicEntries',
  async (payload: { slug: string; pageSize: number; skip: number }) =>
    entriesApi.getPagedPublicEntries(payload.slug, payload.skip, payload.pageSize),
);
export const useFetchPublicEntries = (
  slug: string,
  options: { pageSize?: number } = {},
) => {
  const { pageSize = 15 } = options;
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(true);
  const [isMore, setIsMore] = useState(false);
  const execute = useCallback(
    (page: number) => {
      if (slug == null) {
        return;
      }
      setLoading(true);
      dispatch(
        fetchPublicEntries({
          slug,
          pageSize,
          skip: page * pageSize,
        }),
      )
        .unwrap()
        .then((result) => {
          setLoading(false);
          setIsMore(result.results.length === pageSize);
        })
        .catch(() => {
          setLoading(false);
        });
    },
    [dispatch, slug, pageSize],
  );
  const entriesData = useAppSelector((state) => state.entities.publicEntries);
  const [pageIndex, setPageIndex] = useState(0);
  useEffect(() => {
    setPageIndex(0);
  }, [slug]);
  return {
    loading,
    pageIndex,
    setPageIndex,
    isMore,
    entriesData,
    execute,
  };
};

export const addEntry = createAsyncThunk<Entry, CreateEntryPayload, { state: RootState }>(
  'entities/addEntry',
  async (payload: CreateEntryPayload, { dispatch }) => {
    const addedEntry = await entriesService.addEntry(payload);
    dispatch(fetchUserStats());
    return addedEntry;
  },
  {
    condition: (_, { getState }) =>
      getState().entities.addEntryStatus !== AsyncStatus.PENDING,
  },
);

export const uploadFile = createAsyncThunk<
  FileUploadPresignedUrlResponse,
  { file: File; url: string },
  { state: RootState }
>('entities/uploadFile', async ({ file }, { dispatch }) => {
  const response = await entriesService
    .getFileUploadPresignedUrl(file)
    .then((r) => r.data);
  await axios.put(response.url, file, {
    headers: {
      'Content-Type': file.type,
      'Content-Length': file.size,
    },
    onUploadProgress: (progressEvent) => {
      dispatch(
        updateFileUploadProgress([file.name, progressEvent.loaded / progressEvent.total]),
      );
    },
  });
  return response;
});

export const updateEntry = createAsyncThunk(
  'entities/updateEntry',
  async ({ id, payload }: { id: string; payload: UpdateEntryPayload }) => {
    return await entriesService.updateEntry(id, payload);
  },
);

export const deleteEntry = createAsyncThunk<{}, string, { state: RootState }>(
  'entities/deleteEntry',
  async (id: string, { dispatch }) => {
    const result = await entriesService.deleteEntry(id);
    dispatch(fetchUserStats());
    return result;
  },
  {
    condition: (_, { getState }) =>
      getState().entities.deleteEntryStatus !== AsyncStatus.PENDING,
  },
);
