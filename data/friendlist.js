import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function getFriendList(uid) {
  try {
    const friendList = [];
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `${uid}/friendlist`));

    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        friendList.push({
          uid: childSnapshot.val().uid,
          name: childSnapshot.val().name,
        });
      });
    } else {
      throw new Error('Friend list not found');
    }

    return friendList;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
}
