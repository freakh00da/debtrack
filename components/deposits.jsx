import React, {useEffect, useState} from 'react';
import Typography from '@mui/material/Typography';
import Title from './title';
import {DataMto} from '../data/mto';
import {DataOtm} from '../data/otm';
import {useAuth} from '../context/AuthContext';

export default function Deposits() {
  const [totalMto, setTotalMto] = useState(0);
  const [totalOtm, setTotalOtm] = useState(0);

  const {user} = useAuth();
  const uid = user.uid;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const dataMto = await DataMto(uid);
        const dataOtm = await DataOtm(uid);

        const calculatedMto = calculateMto(dataMto);
        const calculatedOtm = calculateOtm(dataOtm);

        setTotalMto(calculatedMto);
        setTotalOtm(calculatedOtm);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
        setTotalMto(0);
        setTotalOtm(0);
      }
    };

    fetchData();
  }, [uid]);

  const calculateMto = (data) => {
    return data.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  };

  const calculateOtm = (data) => {
    return data.reduce((total, transaction) => {
      return total + transaction.amount;
    }, 0);
  };

  const mtoFormatted = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(totalMto);
  const otmFormatted = new Intl.NumberFormat('id-ID', {style: 'currency', currency: 'IDR'}).format(totalOtm);

  const getCurrentDate = () => {
    const date = new Date();

    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', {month: 'long'});
    const year = date.getFullYear();

    return `on ${day} ${month}, ${year}`;
  };

  const currentDate = getCurrentDate();

  return (
    <React.Fragment>
      <Title>Total Hutang Saya</Title>
      <Typography component="p" variant="h4">
        {mtoFormatted}
      </Typography>
      <Title>Total Hutang Orang</Title>
      <Typography component="p" variant="h4">
        {otmFormatted}
      </Typography>
      <Typography color="text.secondary" sx={{flex: 1}}>
        {currentDate}
      </Typography>
    </React.Fragment>
  );
}
