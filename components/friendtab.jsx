import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import FriendList from './friendlist';
import FriendRequest from './friendreq';

function LinkTab(props) {
  return (
    <Tab
      component="a"
      onClick={(event) => {
        event.preventDefault();
      }}
      {...props}
    />
  );
}

export default function FriendTab() {
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{width: '100%'}}>
      <Tabs value={value} onChange={handleChange} aria-label="nav tabs example">
        <LinkTab label="FRIEND LIST" value={0} />
        <LinkTab label="FRIEND REQUEST" value={1} />
      </Tabs>
      {value === 0 && <FriendList />}
      {value === 1 && <FriendRequest />}
    </Box>
  );
}
