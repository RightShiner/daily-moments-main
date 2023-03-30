import { useRouter } from 'next/router';
import { useIsomorphicLayoutEffect } from './useIsomorphicEffect';
import { useSession } from 'next-auth/react';

export const useRequireUser = () => {
  const session = useSession();
  const router = useRouter();
  useIsomorphicLayoutEffect(() => {
    if (session.status !== 'loading' && session?.data?.user == null) {
      router.replace('/-/login');
    }
  }, [session, router]);
};
