import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue } from "firebase/database";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { reaction } from "mobx"
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig.js"

/* 
 * How to save and read model properties to and from firebase
 * Also how to change the model from views

    First create a new property in the pixeModel.js like:" color: "black" ".
    Add the model property that you want to save to the realtime database (e.g. "model.color") in the 'vars' array.
    Import the useModel() function from model-provider.js in your presenter and define a const model.
    Like: "const model = useModel();".
    Pass the model as a prop to the view.
    Change the model in the view by changing props.model.somePropertyOfTheModel.

    Note: the view must have the parameter "props" in this case.
*/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
export const auth = getAuth(app);
export {signOut};
const PATH = "pixeModel";

//! Incase of 
// app.database().goOffline();
// app.database().goOnline();

// list variables of model as Strings here
const vars = [
    "testText",
    "pictures",
    "colorCurrent",
]

export function modelToPersistence(model) {
    let realtimeModel = {};

    //Model properties to be saved to the realtime database.
    vars.forEach(element => {
        realtimeModel[element] = model[element]
    });
    return realtimeModel;
}


export function persistenceToModel(data, model) {
    //Decide which data to be read from the realtime database.
    if (data){
        vars.forEach(element => {
            if (data[element]) {
                model[element] = data[element]
            }
        });
    }
}

export function saveToFirebase(model) {
    const rf = ref(db, model.uid ||  PATH);

    if (model.ready) {
        set(rf, modelToPersistence(model));
    }
}

export function readFromFirebase(model) {
    model.ready = false;
    const rf = ref(db, model.uid || PATH);
    return get(rf).then(convertACB);

    function convertACB(snapshot) {
        persistenceToModel(snapshot.val(), model);
        model.ready = true;
    }
}

export function connectToFirebase(model) {
    onAuthStateChanged(auth, (user) => {
        if(user){
            model.uid = user.uid;
            readFromFirebase(model)
        }
    })

    readFromFirebase(model);
    reaction(modelChangedACB, storedStateEffectACB);
    
    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelChangedACB() {
        let out = [];
        vars.forEach(element => {
            out.push(model[element]);
        });
        return out;
    }
}

export default connectToFirebase;

export { app };