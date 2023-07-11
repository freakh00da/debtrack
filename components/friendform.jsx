import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import {database} from '../config/firebase';
import {set, ref} from 'firebase/database';
import {useAuth} from '../context/AuthContext';
import {getCredential} from '../data/user';
import QrScanner from 'qr-scanner';

export default function FriendForm() {
  const [uid, setUid] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [showCamera, setShowCamera] = React.useState(false);
  const [scanError, setScanError] = React.useState(false);
  const [credential, setCredential] = React.useState();
  const {user} = useAuth();
  const myUid = user.uid;
  const handleInputChange = (e) => {
    const {name, value} = e.target;
    if (name === 'uid') {
      setUid(value);
    } else if (name === 'message') {
      setMessage(value);
    }
  };

  const [scanner, setScanner] = React.useState(null);
  const videoRef = React.useRef(null);

  const openCamera = () => {
    setShowCamera(true);
    setScanError(false);

    const qrScanner = new QrScanner(videoRef.current, (result) => {
      if (result) {
        setUid(result);
      } else {
        setScanError(true);
      }
      qrScanner.stop();
      setShowCamera(false);
    });

    setScanner(qrScanner);
    qrScanner.start();
  };

  React.useEffect(() => {
    const fetchCredential = async () => {
      try {
        const data = await getCredential(myUid);
        setCredential(data);
      } catch (error) {
        console.error('terjadi kesalahan', error);
        return null;
      }
    };

    fetchCredential();
  }, [myUid]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (uid && message) {
      const requestData = {
        uid: myUid,
        message: message,
        name: credential.name,
      };

      await set(ref(database, `${uid}/friendreq/${myUid}`), requestData)
        .then(() => {
          // Success: data pushed to database
          setUid('');
          setMessage('');
        })
        .catch((error) => {
          console.error('Error pushing data to database:', error);
        });
    }
  };

  React.useEffect(() => {
    return () => {
      if (scanner) {
        scanner.stop();
      }
    };
  }, [scanner]);

  return (
    <Box
      component="form"
      sx={{
        '& > :not(style)': {m: 1, width: '25ch'},
      }}
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit}
    >
      <TextField onChange={handleInputChange} id="outlined-basic-email" label="uid" variant="outlined" name="uid" value={uid} />
      {showCamera ? (
        <Box sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
          <video ref={videoRef} style={{width: '100%', height: 'auto'}}></video>
          {scanError && <p>Error scanning QR code. Please try again.</p>}
        </Box>
      ) : (
        <Button variant="outlined" sx={{py: 2}} onClick={openCamera}>
          Open Camera
        </Button>
      )}
      <TextField onChange={handleInputChange} id="outlined-basic-message" label="Message" variant="outlined" name="message" value={message} />
      <Button type="submit" sx={{py: 2}} variant="contained" endIcon={<SendIcon />}>
        Send Request
      </Button>
    </Box>
  );
}
