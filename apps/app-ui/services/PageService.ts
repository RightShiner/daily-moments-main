import axios, { AxiosResponse } from 'axios';
import { Page } from '@dm/models';

export const getPublicPageBySlug = (slug: string) =>
  axios
    .get<{ slug: string; name: string | null; userId: string | null }>(
      `/v1/pages/${slug}`,
    )
    .then((d) => d.data);

export const getUserPublicPage = () => axios.get<Page>(`/v1/pages`).then((d) => d.data);

export const postUpdatePage = (updatedPage: Page) =>
  axios
    .patch<Page, AxiosResponse<Page>>(`/v1/pages`, updatedPage)
    .then((d) => d.data)
    .catch((e) => {
      if (e.response.status === 400) {
        throw new Error(e.response.data.message);
      }
      throw e;
    });
