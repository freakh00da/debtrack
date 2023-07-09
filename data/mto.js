import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function DataMto(uid) {
  try {
    const dataMto = [];
    const dbref = ref(database);
    const snapshot = await get(child(dbref, `${uid}/dataMto`));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        dataMto.push({
          id: childSnapshot.val().id,
          date: childSnapshot.val().date,
          name: childSnapshot.val().name,
          place: childSnapshot.val().place,
          detail: childSnapshot.val().detail,
          amount: childSnapshot.val().amount,
        });
      });
    } else {
      throw new Error('Data not found');
    }

    return dataMto;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
}
