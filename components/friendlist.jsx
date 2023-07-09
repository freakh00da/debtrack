import React, {useState, useEffect} from 'react';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import {getFriendList} from '../data/friendlist';
import {DataOtm} from '../data/otm';
import {DataMto} from '../data/mto';
import {useAuth} from '../context/AuthContext';

export default function FriendList() {
  const columns = [
    {id: 'name', label: 'Name', minWidth: 170},
    {
      id: 'mto',
      label: 'saya ke ybs',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'otm',
      label: 'ybs ke saya',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
    {
      id: 'status',
      label: 'Status',
      minWidth: 170,
      align: 'right',
      format: (value) => value.toLocaleString('en-US'),
    },
  ];

  const [rows, setRows] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const {user} = useAuth();
  const uid = user.uid;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataMto = await DataMto(uid);
        const dataOtm = await DataOtm(uid);
        const friend = await getFriendList(uid);

        const updatedRows = createData(friend, dataMto, dataOtm);
        setRows(updatedRows);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setRows([]);
      }
    };

    fetchData();
  }, [uid]);

  const createData = (friend, mto, otm) => {
    return friend.map((f) => {
      const {name} = f;

      // Menghitung total amount dari dataMto berdasarkan nama teman
      const mtoTotalAmount = mto.reduce((total, transaction) => {
        if (transaction.name === name) {
          return total + transaction.amount;
        }
        return total;
      }, 0);

      // Menghitung total amount dari dataOtm berdasarkan nama teman
      const otmTotalAmount = otm.reduce((total, transaction) => {
        if (transaction.name === name) {
          return total + transaction.amount;
        }
        return total;
      }, 0);

      const mtoFormatted = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(mtoTotalAmount);
      const otmFormatted = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(otmTotalAmount);

      const status = otmTotalAmount - mtoTotalAmount;
      const statusText = status === 0 ? 'lunas' : new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(status);

      return {name, mto: mtoFormatted, otm: otmFormatted, status: statusText};
    });
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  return (
    <Paper sx={{width: '100%', overflow: 'hidden'}}>
      <TableContainer sx={{maxHeight: 440}}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell key={column.id} align={column.align} style={{minWidth: column.minWidth}}>
                  {column.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody sx={{gap: 2}}>
            {rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
                {columns.map((column) => {
                  const value = row[column.id];
                  return (
                    <TableCell key={column.id} align={column.align}>
                      {column.format && typeof value === 'number' ? column.format(value) : value}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination rowsPerPageOptions={[10, 25, 100]} component="div" count={rows.length} rowsPerPage={rowsPerPage} page={page} onPageChange={handleChangePage} onRowsPerPageChange={handleChangeRowsPerPage} />
    </Paper>
  );
}
