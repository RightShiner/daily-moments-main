import axios, { AxiosResponse } from 'axios';
import { Entry } from './models/entry';
import {
  FileUploadPresignedUrlResponse,
  RequestFilePresignedUrlPayload,
} from '../store/actions/entries/models';

export interface PagedEntries {
  results: Entry[];
  metadata: {
    numResults: number;
  };
}

export const getPagedEntries = (
  skip: number,
  size: number = 10,
  additionalParams: Record<string, string | null> = {},
) =>
  axios
    .get<PagedEntries>(`/v1/entries`, {
      params: {
        skip,
        size,
        ...additionalParams,
      },
    })
    .then((d) => d.data);

export const getPagedPublicEntries = (
  slug: string,
  skip: number,
  size: number = 10,
  additionalParams: Record<string, string | null> = {},
) =>
  axios
    .get<PagedEntries>(`/v1/entries/public/${slug}`, {
      params: {
        skip,
        size,
        ...additionalParams,
      },
    })
    .then((d) => d.data);

export interface CreateEntryPayload {
  date: string;
  content: string;
  isPublic: boolean;
  media: string[];
  timeLockDate: string | null;
}

export const addEntry = (createEntryPayload: CreateEntryPayload) => {
  return axios.post<Entry>(`/v1/entries`, createEntryPayload).then((d) => d.data);
};

export type UpdateEntryPayload = Omit<Entry, 'id' | 'date'>;

export const updateEntry = (id: string, updateEntryPayload: UpdateEntryPayload) =>
  axios.patch<Entry>(`/v1/entries/${id}`, updateEntryPayload).then((d) => d.data);

export const deleteEntry = (id: string) =>
  axios.delete<{}>(`/v1/entries/${id}`).then((d) => d.data);

export const getFileUploadPresignedUrl = async (file: File) =>
  file.type.startsWith('image/')
    ? new Promise((resolve) => {
        const img = new Image();
        img.onload = function () {
          resolve({ width: (this as any).width, height: (this as any).height });
        };
        img.src = URL.createObjectURL(file);
      }).then(({ width, height }) => {
        return axios.post<
          FileUploadPresignedUrlResponse,
          AxiosResponse<FileUploadPresignedUrlResponse>,
          RequestFilePresignedUrlPayload
        >(`/v1/entries/attachment-upload`, {
          name: file.name,
          size: file.size,
          type: file.type,
          width,
          height,
        });
      })
    : axios.post<
        FileUploadPresignedUrlResponse,
        AxiosResponse<FileUploadPresignedUrlResponse>,
        RequestFilePresignedUrlPayload
      >(`/v1/entries/attachment-upload`, {
        name: file.name,
        size: file.size,
        type: file.type,
      });
