import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function getCredential(uid) {
  try {
    const credential = [];
    const dbref = ref(database);
    const snapshot = await get(child(dbref, `${uid}/credential`));
    console.log('Snapshot cred:', snapshot.val());
    if (snapshot.exists()) {
      credential.push({
        uid: snapshot.val().uid,
        name: snapshot.val().name,
        email: snapshot.val().email,
      });
    } else {
      throw new Error('Data not found');
    }

    return credential[0]; // Mengembalikan objek credential yang ada di dalam array
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return null; // Mengembalikan null jika terjadi kesalahan
  }
}
