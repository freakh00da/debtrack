import React, {useState, useEffect} from 'react';
import Link from '@mui/material/Link';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './title';
import {DataOtm} from '../data/otm';
import {useAuth} from '../context/AuthContext';

export default function ListOtm() {
  const [rows, setRows] = useState([]);
  const {user} = useAuth();
  const uid = user.uid;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await DataOtm(uid);
        setRows(data);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setRows([]);
      }
    };

    fetchData();
  }, [uid]);

  function preventDefault(event) {
    event.preventDefault();
  }

  return (
    <React.Fragment>
      <Title>Daftar Hutang Orang</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Tanggal</TableCell>
            <TableCell>Nama</TableCell>
            <TableCell>Tempat</TableCell>
            <TableCell>Keterangan</TableCell>
            <TableCell align="right">Jumlah</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.place}</TableCell>
              <TableCell>{row.detail}</TableCell>
              <TableCell align="right">{new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(row.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Link color="primary" href="#" onClick={preventDefault} sx={{mt: 3}}>
        See more
      </Link>
    </React.Fragment>
  );
}
