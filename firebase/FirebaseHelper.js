import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { database } from "./FirebaseSetup";

export async function writeToDB(data, collectionName) {
  try {
    const docRef = await addDoc(collection(database, collectionName), data);
    console.log(docRef);
  } catch (err) {
    console.log("write to db ", err);
  }
}

export async function deleteFromDB(deletedId, collectionName) {
  try {
    await deleteDoc(doc(database, collectionName, deletedId));
    console.log("deleteFromDB", deletedId, collectionName);
  } catch (err) {
    console.log("delete from db ", err);
  }
}

export async function deleteAllFromDB(collectionName) {
  try {
    const querySnapshot = await getDocs(collection(database, collectionName));
    querySnapshot.forEach((docSnapshot) => {
      deleteDoc(doc(database, collectionName, docSnapshot.id));
    });
  } catch (err) {
    console.log("delete all from db ", err);
  }
}

export async function updateDB(data, docId, collectionName) {
  try {
    await setDoc(doc(database, collectionName, docId), data);
    console.log("updateDB", data, docId, collectionName);
  } catch (err) {
    console.log("update db ", err);
  }
}