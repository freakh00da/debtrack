import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function getDataReqList(uid) {
  try {
    const reqdata = [];
    const dbref = ref(database);
    const snapshot = await get(child(dbref, `${uid}/reqlist`));
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        reqdata.push({
          uid: childSnapshot.val().uid,
          place: childSnapshot.val().place,
          id: childSnapshot.val().id,
          detail: childSnapshot.val().detail,
          date: childSnapshot.val().date,
          amount: childSnapshot.val().amount,
          name: childSnapshot.val().name,
        });
      });
    } else {
      throw new Error('Data not found');
    }

    return reqdata;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
}
