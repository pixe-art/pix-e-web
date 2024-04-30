import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
import { reaction } from "mobx"
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig.js"

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const PATH = "pixeModel";
export const auth = getAuth(app);
export {signOut};

export function modelToPersistence(model) {
    let realtimeModel = null;

    //Model properties to be saved to the realtime database.
    realtimeModel = {testText: model.testText};
    realtimeModel.pictures = model.pictures;
    //Add more properties here like: realtimeModel.color = model.color;

    return realtimeModel;
}

export function persistenceToModel(data, model) {
    //Decide which data to be read from the realtime database.
    if (data){
        if (data.testText) {
            model.testText = data.testText;
        }

        if (data.pictures){
            model.pictures = data.pictures;
        }

        //Add more data here like: 
        //if (data.color)
        //  model.color = data.color;
    }
}

export function saveToFirebase(model) {
    const rf = ref(db, PATH);

    if (model.ready) {
        set(rf, modelToPersistence(model));
    }
}
/*
export function saveToFirebase(model) {
    model.forEach(image => {
        const rf = ref(db, `${PATH}/${image.id}`);
        set(rf, modelToPersistence(image));
    });
}*/

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
    /*
    readFromFirebase(model).then(() => {
        saveToFirebase(model);
    });*/
    reaction(modelChangedACB, storedStateEffectACB);

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelChangedACB() {
        return [model.testText, model.pictures];
    }
}

export default connectToFirebase;

export { app };