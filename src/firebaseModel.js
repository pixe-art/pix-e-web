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

    realtimeModel = {
        title: model.title,
        creator: model.creator,
        picture: model.testPicture
    };

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
    model.forEach(image => {
        const rf = ref(db, `${PATH}/${image.id}`);
        set(rf, modelToPersistence(image));
    });
}

export function readFromFirebase(model) {
    const rf = ref(db, PATH);
    return get(rf).then(convertACB);

    function convertACB(snapshot) {
        persistenceToModel(snapshot.val(), model);
    }
}

export function connectToFirebase(model) {
    readFromFirebase(model).then(() => {
        saveToFirebase(model);
    });
    reaction(modelChangedACB, storedStateEffectACB);

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelChangedACB() {
        return model.testPicture;
    }
}

export default connectToFirebase;