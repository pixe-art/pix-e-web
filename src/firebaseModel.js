import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue } from "firebase/database";
//import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

import firebaseConfig from "./firebaseConfig.js"

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const imageDb = getStorage(app);

function persistenceToModel(data_from_firebase, model) {
    
}

async function addPictureToFirebase(picture) {
    await set(ref(db, 'picture'), picture);
}

async function readPictureFromFirebase(model) {
    model.ready = false;
    const snapshot = await get(ref(db, 'picture'));
    await persistenceToModel(snapshot.val(), model);
    model.ready = true;
}

async function readFromFirebase(model) {
    model.ready = false;
    const snapshot = await get(ref(db, '/'));
    await persistenceToModel(snapshot.val(), model);
    model.ready = true;
}

export { imageDb, readFromFirebase, addPictureToFirebase, readPictureFromFirebase};