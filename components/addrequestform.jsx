import React, {useState, useEffect} from 'react';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import {getFriendList} from '../data/friendlist';
import {useAuth} from '../context/AuthContext';
import {ref, set, serverTimestamp} from 'firebase/database';
import {database} from '../config/firebase';
import {nanoid} from 'nanoid';

const AddRequestForm = ({handleAddReqlick}) => {
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');
  const [tempat, setTempat] = useState('');
  const [detail, setDetail] = useState('');
  const [friendList, setFriendList] = useState([]);

  const {user} = useAuth();
  const uid = user.uid;
  useEffect(() => {
    const fetchFriendList = async () => {
      try {
        const list = await getFriendList(uid);
        setFriendList(list);
      } catch (error) {
        console.error('Terjadi kesalahan:', error);
      }
    };

    fetchFriendList();
  }, [uid]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const selectedFriend = friendList.find((friend) => friend.name === nama);

    const requestData = {
      name: nama,
      amount: nominal,
      date: serverTimestamp(),
      detail: detail,
      place: tempat,
      uid: uid,
      id: nanoid(8),
    };

    // Proses pengiriman data ke rtdb
    set(ref(database, `${selectedFriend.uid}/reqlist/${uid}`), requestData)
      .then(() => {
        // Reset form setelah pengiriman
        setNama('');
        setNominal('');
        setTempat('');
        setDetail('');
      })
      .catch((error) => {
        console.error('Terjadi kesalahan:', error);
      });
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField select label="Kepada" value={nama} onChange={(e) => setNama(e.target.value)} fullWidth required margin="normal">
        {friendList.map((friend) => (
          <MenuItem key={friend.uid} value={friend.name}>
            {friend.name}
          </MenuItem>
        ))}
      </TextField>
      <TextField type="number" label="Nominal" value={nominal} onChange={(e) => setNominal(e.target.value)} fullWidth required margin="normal" />
      <TextField label="Tempat" value={tempat} onChange={(e) => setTempat(e.target.value)} fullWidth required margin="normal" />
      <TextField label="Detail" value={detail} onChange={(e) => setDetail(e.target.value)} fullWidth required multiline rows={4} margin="normal" />
      <div>
        <Button type="submit" variant="contained" color="primary">
          Submit
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleAddReqlick} sx={{marginLeft: '10px'}}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default AddRequestForm;
