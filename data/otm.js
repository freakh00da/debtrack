import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function DataOtm(uid) {
  try {
    const dataOtm = [];
    const dbref = ref(database);
    const snapshot = await get(child(dbref, `${uid}/dataOtm`));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        dataOtm.push({
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

    return dataOtm;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
}
