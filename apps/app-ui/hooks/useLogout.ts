import { useCallback } from 'react';
import { signOut } from 'next-auth/react';
import { useAppDispatch } from '../store';
import { globalReset } from '../store/global.actions';
import { useRouter } from 'next/router';

export const useLogout = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  return useCallback(() => {
    signOut({ redirect: false }).then(() => {
      router.replace('/-/login');
      dispatch(globalReset());
    });
  }, [dispatch, router]);
};
