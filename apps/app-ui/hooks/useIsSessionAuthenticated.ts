import { useSession } from 'next-auth/react';

export const useIsSessionAuthenticated = () => useSession()?.data?.user != null;
