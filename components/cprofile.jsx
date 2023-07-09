import React, {useEffect, useState} from 'react';
import {Box, Typography, Button} from '@mui/material';
import {useAuth} from '../context/AuthContext';
import {useRouter} from 'next/router';
import {getCredential} from '../data/user';
import QRCode from 'qrcode';

export default function CProfile() {
  const {user, logout} = useAuth();
  const router = useRouter();
  const uid = user.uid;
  const [credential, setCredential] = useState(null);
  const [qrCode, setQRCode] = useState(null);

  useEffect(() => {
    const fetchCredential = async () => {
      try {
        const credentialData = await getCredential(uid);
        setCredential(credentialData);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setCredential(null);
      }
    };

    fetchCredential();
  }, [uid]);

  useEffect(() => {
    const generateQR = async () => {
      try {
        const qrCodeData = await QRCode.toDataURL(uid);
        setQRCode(qrCodeData);
      } catch (err) {
        console.error(err);
      }
    };
    generateQR();
  }, [uid]);

  return (
    <Box sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
      <Box>
        <Box sx={{width: '200px', height: '200px'}}>{qrCode && <img src={qrCode} alt="QR Code" />}</Box>
        {credential && (
          <>
            <Typography variant="subtitle1">Email: {credential.email}</Typography>
            <Typography variant="subtitle1">Name: {credential.name}</Typography>
          </>
        )}
      </Box>
      <Button
        variant="outlined"
        onClick={() => {
          logout();
          router.push('/login');
        }}
      >
        Logout
      </Button>
    </Box>
  );
}
