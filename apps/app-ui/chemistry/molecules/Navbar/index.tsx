import React, { useCallback, useMemo } from 'react';
import {
  DesktopNavContent,
  MobileNavContent,
  Navbar as CommonNavbar,
  NavBarLink,
} from '@dm/chemistry';
import {
  Box,
  Button,
  IconButton,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuList,
  Spacer,
} from '@chakra-ui/react';
import { useIsSessionAuthenticated } from '../../../hooks/useIsSessionAuthenticated';
import { useLogout } from '../../../hooks/useLogout';
import Link from 'next/link';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useRouter } from 'next/router';

export const Navbar = () => {
  const isSessionAuthenticated = useIsSessionAuthenticated();
  const executeLogout = useLogout();
  const router = useRouter();
  const executeGoToLogin = useCallback(() => router.push('/-/login'), [router]);
  const executeGoToJournal = useCallback(() => router.push('/'), [router]);
  const executeGoToAccount = useCallback(() => router.push('/account'), [router]);
  const executeGoToSupport = useCallback(() => router.push('/support'), [router]);

  const mobileLinks: NavBarLink[] = useMemo(
    () => [
      {
        label: 'Login',
        onClick: executeGoToLogin,
        shouldDisplay: !isSessionAuthenticated,
      },
      {
        label: 'Journal',
        onClick: executeGoToJournal,
        shouldDisplay: isSessionAuthenticated,
      },
      {
        label: 'Account',
        onClick: executeGoToAccount,
        shouldDisplay: isSessionAuthenticated,
      },
      {
        label: 'Support',
        onClick: executeGoToSupport,
        shouldDisplay: isSessionAuthenticated,
      },
      {
        label: 'Logout',
        onClick: executeLogout,
        shouldDisplay: isSessionAuthenticated,
      },
    ],
    [executeGoToLogin, executeGoToJournal, isSessionAuthenticated],
  );

  const desktopLinks: NavBarLink[] = useMemo(
    () => [
      {
        label: 'Login',
        onClick: executeGoToLogin,
        shouldDisplay: !isSessionAuthenticated,
      },
      {
        label: 'Menu',
        shouldDisplay: isSessionAuthenticated,
        component: (
          <Menu>
            <MenuButton
              as={IconButton}
              variant={'outline'}
              icon={<BsThreeDotsVertical />}
            />
            <MenuList>
              <MenuItem onClick={executeGoToAccount}>Account</MenuItem>
              <MenuItem onClick={executeGoToSupport}>Support</MenuItem>
              <MenuDivider />
              <MenuItem onClick={executeLogout}>Logout</MenuItem>
            </MenuList>
          </Menu>
        ),
      },
    ],
    [
      isSessionAuthenticated,
      executeGoToLogin,
      executeGoToAccount,
      executeGoToSupport,
      executeLogout,
    ],
  );

  return (
    <>
      <CommonNavbar>
        <MobileNavContent links={mobileLinks}>
          {({ onToggle }) =>
            !isSessionAuthenticated ? (
              <>
                <Spacer />
                <Link href={'/-/login'}>
                  <Box as={'a'} display={'grid'} w={'100%'} onClick={onToggle}>
                    <Button variant={'outline'}>Login</Button>
                  </Box>
                </Link>
              </>
            ) : (
              <></>
            )
          }
        </MobileNavContent>
        <DesktopNavContent links={desktopLinks} />
      </CommonNavbar>
    </>
  );
};
