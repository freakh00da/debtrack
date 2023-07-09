import React, {useEffect, useState} from 'react';
import {Box, Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {getFriendRequest} from '../data/friendrequest';
import {useAuth} from '../context/AuthContext';
import {set, ref, remove} from 'firebase/database';
import {database} from '../config/firebase';
import {getCredential} from '../data/user';

export default function FriendRequest() {
  const [requests, setRequests] = useState([]);
  const {user} = useAuth();
  const myUid = user.uid;

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getFriendRequest(myUid);
        setRequests(data);
      } catch (error) {
        console.error('Terjadi kesalahan fetch request:', error);
        setRequests([]);
      }
    };

    fetchRequests();
  }, [myUid]);

  const handleAccept = async (friendData) => {
    try {
      const {uid} = friendData;
      const myName = await getCredential(myUid);
      const myData = {
        name: myName.name,
        uid: myUid,
      };
      if (uid) {
        const friendListRef = ref(database, `${myUid}/friendlist/${uid}`);
        const myListRef = ref(database, `${uid}/friendlist/${myUid}`);
        await set(friendListRef, friendData);
        await set(myListRef, myData);
        // Menghapus permintaan pertemanan setelah diterima
        await remove(ref(database, `${myUid}/friendreq/${uid}`));
        await remove(ref(database, `${myUid}/friendlist/${uid}/message`));
        await remove(ref(database, `${uid}/friendlist/${myUid}/message`));

        // Mengupdate state requests setelah permintaan pertemanan diterima
        setRequests((prevRequests) => prevRequests.filter((request) => request.uid !== uid));
      } else {
        console.error('uid is undefined for friendData:', friendData);
      }
    } catch (error) {
      console.error('Terjadi kesalahan pada handleAccept:', error);
    }
  };

  const handleReject = async (request) => {
    try {
      // Menghapus permintaan pertemanan yang ditolak
      await remove(ref(database, `friendrequests/${myUid}/${request.uid}`));
    } catch (error) {
      console.error('Terjadi kesalahan pada handleReject:', error);
    }
  };

  return (
    <Box sx={{mt: 3}}>
      <Paper>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Pesan</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography variant="body1" color="textSecondary" align="center">
                      No request yet
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                requests.map((request) => (
                  <TableRow key={request.uid}>
                    <TableCell>{request.name}</TableCell>
                    <TableCell>{request.message}</TableCell>
                    <TableCell>
                      <Button variant="contained" color="primary" onClick={() => handleAccept(request)}>
                        Accept
                      </Button>
                      <Button variant="contained" color="secondary" onClick={() => handleReject(request)}>
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
