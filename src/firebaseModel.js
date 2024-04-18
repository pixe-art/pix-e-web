import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue } from "firebase/database";
import { getAuth } from "firebase/auth";
import { reaction } from "mobx"
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig.js"

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const PATH = "pixeModel";

export function modelToPersistence(model) {
    let realtimeModel = null;

    realtimeModel = {picture: model.testPicture};

    return realtimeModel;
}

export function persistenceToModel(data, model) {
    if (data){
        if (data.picture) {
            model.testPicture = ["It works!"]
        }
    }
}

export function saveToFirebase(model) {
    const rf = ref(db, PATH);

    if (model.ready) {
        set(rf, modelToPersistence(model));
    }
}

export function readFromFirebase(model) {
    model.ready = false;
    const rf = ref(db, PATH);
    return get(rf).then(convertACB);

    function convertACB(snapshot) {
        persistenceToModel(snapshot.val(), model);
        model.ready = true;
    }
}

export function connectToFirebase(model) {
    readFromFirebase(model);
    reaction(modelChangedACB, storedStateEffectACB);

    // For testing
    setTimeout(() => { model.testPicture = ["Changed!"]; }, 2000);
    setTimeout(() => { console.log(model.testPicture[0]); }, 1000);
    setTimeout(() => { console.log(model.testPicture[0]); }, 3000);
    // End of testing

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelChangedACB() {
        return [model.testPicture];
    }
}

export default connectToFirebase;