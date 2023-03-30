import { useEffect, useLayoutEffect } from 'react';
import { canUseDOM } from '../app/utilities';

export const useIsomorphicLayoutEffect = canUseDOM ? useLayoutEffect : useEffect;
