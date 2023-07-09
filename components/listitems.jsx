import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AllInboxIcon from '@mui/icons-material/AllInbox';

export const mainListItems = (handleDashboardClick, handleFriendListClick, handleReqListClick) => (
  <React.Fragment>
    <ListItemButton onClick={handleDashboardClick}>
      <ListItemIcon>
        <DashboardIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton onClick={handleFriendListClick}>
      <ListItemIcon>
        <PeopleIcon />
      </ListItemIcon>
      <ListItemText primary="Friend List" />
    </ListItemButton>
    <ListItemButton onClick={handleReqListClick}>
      <ListItemIcon>
        <AllInboxIcon />
      </ListItemIcon>
      <ListItemText primary="Request List" />
    </ListItemButton>
  </React.Fragment>
);

export const secondaryListItems = (handleProfileClick) => (
  <React.Fragment>
    <ListSubheader component="div" inset>
      User
    </ListSubheader>
    <ListItemButton onClick={handleProfileClick}>
      <ListItemIcon>
        <AccountCircleIcon />
      </ListItemIcon>
      <ListItemText primary="My Profile" />
    </ListItemButton>
  </React.Fragment>
);
