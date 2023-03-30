import { useEffect, useRef } from 'react';
import { AsyncStatus } from '../store/types';

interface Options {
  onSuccess?: () => void;
  onFailure?: () => void;
}

export const useWatchAsyncStatus = (
  status: AsyncStatus,
  { onSuccess, onFailure }: Options,
) => {
  const lastSeen = useRef<AsyncStatus>();
  useEffect(() => {
    if (
      status === AsyncStatus.SUCCESS &&
      lastSeen.current === AsyncStatus.PENDING &&
      onSuccess != null
    ) {
      onSuccess();
    } else if (
      status === AsyncStatus.FAILURE &&
      lastSeen.current === AsyncStatus.PENDING &&
      onFailure != null
    ) {
      onFailure();
    }
    lastSeen.current = status;
  }, [status]);
};
