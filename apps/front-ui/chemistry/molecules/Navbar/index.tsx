import {
  DesktopNavContent,
  MobileNavContent,
  Navbar as CommonNavbar,
  NavBarLink,
  PrimaryButton,
} from '@dm/chemistry';
import React, { useMemo } from 'react';
import { CgProfile } from 'react-icons/cg';
import { getAppLink } from '../../../app/frontend-helpers';

export const Navbar = () => {
  const desktopLinks: NavBarLink[] = useMemo(
    () => [
      {
        label: 'Login',
        component: (
          <a href={getAppLink('/')}>
            <PrimaryButton leftIcon={<CgProfile />}>Login</PrimaryButton>
          </a>
        ),
      },
    ],
    [],
  );
  return (
    <CommonNavbar>
      <MobileNavContent links={[]} />
      <DesktopNavContent links={desktopLinks} />
    </CommonNavbar>
  );
};
