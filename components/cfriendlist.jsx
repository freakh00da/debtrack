import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import FriendForm from './friendform';
import FriendTab from './friendtab';

export default function CFriendList() {
  const [FriendFormActive, setFriendFormActive] = React.useState(false);
  const [buttonActive, SetButtonActive] = React.useState(false);

  const handleFrienListTab = () => {
    SetButtonActive(false);
  };
  const handleAddClick = () => {
    setFriendFormActive(!FriendFormActive);
  };
  return (
    <React.Fragment>
      <FriendTab />
      {FriendFormActive ? <FriendForm /> : null}
      <Box component="span" sx={{px: 2, my: 3}}>
        {
          <Button onClick={handleAddClick} variant="contained" disableElevation sx={{mt: 2}}>
            {FriendFormActive ? 'CANCEL' : 'ADD NEW FRIEND'}
          </Button>
        }
      </Box>
    </React.Fragment>
  );
}
