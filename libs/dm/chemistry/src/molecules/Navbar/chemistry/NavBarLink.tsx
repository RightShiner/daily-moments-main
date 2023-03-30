import React from 'react';

export interface NavBarLink {
  label: string;
  href?: string;
  onClick?: () => void;
  component?: React.ReactElement;
  shouldDisplay?: boolean | (() => boolean);
}
