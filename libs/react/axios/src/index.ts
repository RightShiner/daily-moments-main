import useAxios, { Options } from 'axios-hooks';
import {
  AxiosError,
  AxiosPromise,
  AxiosRequestConfig,
  AxiosResponse,
  Method,
} from 'axios';
import { useCallback, useMemo } from 'react';

export interface UseAxiosGetResult<T> {
  data: T;
  error?: AxiosError | null;
  loading: boolean;
  execute: (params?: any) => AxiosPromise<T>;
  response?: AxiosResponse;
}
export function useAxiosGet<T>(
  endpoint: string,
  options?: Options,
): UseAxiosGetResult<T> {
  const defaultOptions = {
    manual: true,
    useCache: false,
    ...(options ?? {}),
  };
  const [{ data, error, loading, response }, rawExecute] = useAxios(
    endpoint,
    defaultOptions,
  );
  const execute = useCallback((params?: any) => rawExecute({ params }), [rawExecute]);
  return {
    data: data as T,
    error,
    loading,
    execute,
    response,
  };
}

export function useAxiosPost<B, T>(endpoint: string, options?: Options) {
  return useMutateData<B, T>('POST', endpoint, options);
}
export function useAxiosPatch<B, T>(endpoint: string, options?: Options) {
  return useMutateData<B, T>('PATCH', endpoint, options);
}
export function useAxiosDelete<B, T>(endpoint: string, options?: Options) {
  return useMutateData<B, T>('DELETE', endpoint, options);
}

function useMutateData<B, T>(
  method: Method,
  endpoint: string,
  options?: Options,
  config?: AxiosRequestConfig,
) {
  const defaultOptions = {
    manual: true,
    ...(options ?? {}),
  };
  const defaultConfig = {
    url: endpoint,
    method: method,
    ...(config ?? {}),
  };
  const [{ data, error, loading, response }, executeRaw] = useAxios(
    defaultConfig,
    defaultOptions,
  );
  const sanitizedSingleError = useMemo(
    () => error?.response?.data?.message ?? null,
    [error],
  );
  const sanitizedErrorList = useMemo(() => {
    const messages = error?.response?.data?.messages;
    if (messages != null) {
      const errorMap = new Map<string, string[]>();
      Object.entries(messages)
        .map((entry) => ({
          field: entry[0],
          message: entry[1] as string[],
        }))
        .forEach((entry) => {
          const currentErrorsForField = errorMap.get(entry.field) ?? [];
          entry.message.forEach((m) => currentErrorsForField.push(m));
          errorMap.set(entry.field, currentErrorsForField);
        });
      return errorMap;
    }
    return null;
  }, [error]);
  const execute = useCallback(
    (payload: B, params?: any) =>
      executeRaw({ data: payload, params }) as AxiosPromise<T>,
    [executeRaw],
  );
  return {
    data: data as T,
    error: sanitizedSingleError as string | null,
    errors: sanitizedErrorList,
    loading,
    execute,
    response,
  };
}
