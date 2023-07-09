import {database} from '../config/firebase';
import {ref, child, get} from 'firebase/database';

export async function getFriendRequest(uid) {
  try {
    const friendRequests = [];
    const dbRef = ref(database);
    const snapshot = await get(child(dbRef, `${uid}/friendreq`));
    console.log(snapshot);
    if (snapshot.exists()) {
      snapshot.forEach((childSnapshot) => {
        friendRequests.push({
          uid: childSnapshot.val().uid,
          message: childSnapshot.val().message,
          name: childSnapshot.val().name,
        });
      });
    } else {
      throw new Error('Friend requests not found');
    }

    return friendRequests;
  } catch (error) {
    console.error('Terjadi kesalahan:', error);
    return [];
  }
}
