import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue, update } from "firebase/database";
import { getAuth, signOut } from "firebase/auth";
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
    realtimeModel = {users: model.users};
    realtimeModel.images = model.images;
    realtimeModel.screens = model.screens;
    realtimeModel.paringCodes = model.paringCodes;
    //Add more properties here like: realtimeModel.color = model.color;

    return realtimeModel;
}


export function persistenceToModel(data, model) {
    //Decide which data to be read from the realtime database.
    if (data){
        if (data.images) {
            model.images = data.images;
        }

        if (data.users){
            model.users = data.users;
        }

        if (data.screens){
            model.screens = data.screens;
        }

        if (data.paringCodes){
            model.paringCodes = data.paringCodes;
        }

        //Add more data here like: 
        //if (data.color)
        //  model.color = data.color;
    }
}

export function saveToFirebase(model) {
    const rf = ref(db, model.uid ||  PATH);

    if (model.ready) {
        update(rf, modelToPersistence(model));
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
        return [model.users, model.images, model.screens, model.paringCodes];
    }
}

export default connectToFirebase;

export { app };