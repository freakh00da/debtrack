import * as React from 'react';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import AddRequestForm from './addrequestform';
import RequestList from './reqlist';

export default function CReqList() {
  const [formActive, setFormActive] = React.useState(false); // Mengatur nilai awal formActive
  const handleAddReqlick = () => {
    setFormActive(!formActive);
  };

  return (
    <React.Fragment>
      {formActive ? <AddRequestForm handleAddReqlick={handleAddReqlick} /> : <RequestList />}
      <div style={{position: 'fixed', bottom: '10px', right: '10px'}}>
        {formActive ? null : (
          <Button
            onClick={handleAddReqlick}
            variant="contained"
            sx={{
              width: '200px',
              height: '60px',
              fontSize: '18px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            startIcon={<AddBoxIcon />}
          >
            Add Request
          </Button>
        )}
      </div>
    </React.Fragment>
  );
}
