import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicEffect';
import axios from 'axios';
import { canUseDOM, getCookie } from '../app/utilities';

export const useSetupAxios = () => {
  useSetupAxiosDefaults();
  useInjectAxiosAuthorizationHeader();
};

const useSetupAxiosDefaults = () => {
  useIsomorphicLayoutEffect(() => {
    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL;
  }, []);
};

const useInjectAxiosAuthorizationHeader = () => {
  const currentSessionToken = canUseDOM ? getCookie('next-auth.session-token') : null;

  const interceptorId = useRef<number | null>(null);
  useIsomorphicLayoutEffect(() => {
    const currentId = interceptorId.current;
    if (currentId != null) {
      axios.interceptors.request.eject(currentId);
    }
    interceptorId.current = axios.interceptors.request.use((config) => {
      return new Promise(async (resolve) => {
        if (currentSessionToken != null) {
          config.headers['Authorization'] = `Bearer ${currentSessionToken}`;
        }
        resolve(config);
      });
    });
  }, [currentSessionToken]);
};
