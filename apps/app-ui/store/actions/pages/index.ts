import { RootState, useAppDispatch, useAppSelector } from '../../index';
import { useCallback, useEffect, useState } from 'react';
import { createAsyncThunk } from '@reduxjs/toolkit';
import * as pagesApi from '../../../services/PageService';
import { postUpdatePage } from '../../../services/PageService';
import { setPage, setPublicPage } from '../../slices/page';
import { Page } from '@dm/models';

export const fetchPublicPage = createAsyncThunk(
  'pages/fetchPublicPage',
  async (slug: string) => pagesApi.getPublicPageBySlug(slug),
);
export const useFetchPublicPage = (slug: string) => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [invalidSlug, setInvalidSlug] = useState(false);
  const execute = useCallback(() => {
    if (slug == null) {
      return;
    }

    setLoading(true);
    dispatch(fetchPublicPage(slug))
      .unwrap()
      .then((result) => {
        setLoading(false);
        dispatch(setPublicPage(result));
      })
      .catch((err) => {
        setLoading(false);
        if (err.message === 'Request failed with status code 404') {
          setInvalidSlug(true);
        }
      });
  }, [dispatch, slug]);
  const page = useAppSelector((state) => state.page.publicPage);
  useEffect(() => {
    execute();
  }, [execute]);
  return {
    loading,
    page,
    invalidSlug,
  };
};

export const fetchUserPublicPage = createAsyncThunk(
  'pages/fetchUserPublicPage',
  async () => pagesApi.getUserPublicPage(),
);
export const useFetchUserPublicPage = () => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const execute = useCallback(() => {
    setLoading(true);
    dispatch(fetchUserPublicPage())
      .unwrap()
      .then((result) => {
        setLoading(false);
        dispatch(setPage(result));
      })
      .catch(() => {
        setLoading(false);
      });
  }, [dispatch]);
  const page = useAppSelector((state) => state.page.userPage);
  useEffect(() => {
    execute();
  }, []);
  return {
    loading,
    page,
  };
};

export const updatePage = createAsyncThunk<Page, Page, { state: RootState }>(
  'pages/updatePage',
  async (updatedPage: Page) => postUpdatePage(updatedPage),
);
