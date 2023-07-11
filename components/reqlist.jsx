import React, {useEffect, useState} from 'react';
import {Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography} from '@mui/material';
import {getDataReqList} from '../data/reqlist';
import {useAuth} from '../context/AuthContext';
import {ref, set, remove} from 'firebase/database';
import {database} from '../config/firebase';

export default function ReqListTable() {
  const [reqList, setReqList] = useState([]);
  const {user} = useAuth();
  const myUid = user.uid;

  useEffect(() => {
    const fetchReqList = async () => {
      try {
        const data = await getDataReqList(myUid);
        setReqList(data);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setReqList([]);
      }
    };

    fetchReqList();
  }, [myUid]);
  const handleAccept = async (reqData) => {
    try {
      const {uid} = reqData;
      if (uid) {
        const mtoRef = ref(database, `${uid}/dataMto/${myUid}`);
        const otmRef = ref(database, `${myUid}/dataOtm/${uid}`);
        await set(mtoRef, reqData);
        await set(otmRef, reqData);
        // Menghapus permintaan dari reqList setelah diterima
        await remove(ref(database, `${myUid}/reqlist/${reqData.id}`));

        // Mengupdate state reqList setelah permintaan diterima
        setReqList((prevReqList) => prevReqList.filter((item) => item.id !== reqData.id));
      } else {
        console.error('uid or status is undefined for reqData:', reqData);
      }
    } catch (error) {
      console.error('Terjadi kesalahan pada handleAccept:', error);
    }
  };

  const handleReject = async () => {};

  return (
    <Paper>
      <TableContainer>
        <Typography variant="h5" gutterBottom sx={{margin: 2}}>
          Request List
        </Typography>
        {reqList.length === 0 ? (
          <Typography variant="body1">Tidak ada data Request List.</Typography>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nama</TableCell>
                <TableCell>Tanggal</TableCell>
                <TableCell>Nominal</TableCell>
                <TableCell>Tempat</TableCell>
                <TableCell>Detail</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reqList.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{new Date(item.date).toDateString()}</TableCell>
                  <TableCell>{item.amount}</TableCell>
                  <TableCell>{item.place}</TableCell>
                  <TableCell>{item.detail}</TableCell>
                  <TableCell>
                    <Button variant="contained" color="primary" sx={{marginRight: '10px'}} onClick={() => handleAccept(item)}>
                      Accept
                    </Button>
                    <Button variant="contained" color="error" onClick={() => handleReject(item)}>
                      Reject
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>
    </Paper>
  );
}
