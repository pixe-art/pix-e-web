import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue, update } from "firebase/database";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { reaction } from "mobx"
import { getStorage } from "firebase/storage";
import firebaseConfig from "./firebaseConfig.js"

/* How to save and read model properties to and from firebase. Also how to change the model from views.
First create a new property in the pixeModel.js like:" color: "black" ".
Add the model property in the array in the function modelChangedACB() that you want to save to the realtime database like: "model.color".
Go to functions modelToPersistance and persistanceToModel in this file and read the comments.
Import the useModel() function from model-provider.js in your presenter and define a const model.
Like: "const model = useModel();".
Pass the model as a prop to the view.
Change the model in the view by changing props.model.somePropertyOfTheModel.
Note that the view must have the parameter "props" in this case.
*/
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const PATH = "pixeModel";
export const auth = getAuth(app);
export const storage = getStorage(app);
export {signOut};

export function modelToPersistence(model) {
    let realtimeModel = null;

    function toObject(arr) {
        const obj = {};
        for (const element of arr)
          obj[element.id] = element;
        return obj;
    }

    //Model properties to be saved to the realtime database.
    realtimeModel = {users: model.users};
    realtimeModel.images = toObject(model.images);
    //realtimeModel.images = model.images.reduce(toObjextCB);
    realtimeModel.screens = model.screens;
    realtimeModel.paringCodes = model.paringCodes;
    //Add more properties here like: realtimeModel.color = model.color;

    return realtimeModel;
}

export function userModelToPersistence(model) { 
    let realtimeModel = null;

    realtimeModel = {colorCurrent: model.users[auth.currentUser.uid].colorCurrent};
    realtimeModel.favorites = model.users[auth.currentUser.uid].favorites;
    realtimeModel.device = model.users[auth.currentUser.uid].device;
    realtimeModel.profile = model.users[auth.currentUser.uid].profile;

    return realtimeModel;
}

export function persistenceToModel(data, model) {
    //Decide which data to be read from the realtime database.

    function toArray(obj) {
        const arr = [];
        for (const element in obj)
            arr.push(obj[element]);
        return arr;
    }

    if (data){
        if (data.images) {
            model.images = toArray(data.images);
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
    }
}

export function userPersistenceToModel(data, model) { 
    function toArray(obj) {
        const arr = [];
        for (const element in obj)
            arr.push(obj[element]);
        return arr;
    }

    if (data){
        if (data.colorCurrent) {
            model.users[auth.currentUser.uid].colorCurrent = data.colorCurrent;
        }

        if (data.favorites){
            model.users[auth.currentUser.uid].favorites = toArray(data.favorites);
        }

        if (data.device){
            model.users[auth.currentUser.uid].device = data.device;
        }

        if (data.profile){
            model.users[auth.currentUser.uid].profile = data.profile;
        }
    }
}

export function saveToFirebase(model) {
    const rf = ref(db, PATH);

    if (model.ready) {
        update(rf, modelToPersistence(model));
    }
}

export function saveUserData(model) {
    const rf = ref(db, (PATH + "/users/" + auth.currentUser.uid));

    if (model.ready) {
        update(rf, userModelToPersistence(model));
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

export function readUserData(model) {
    model.ready = false;
    const rf = ref(db, (PATH + "/users/" + auth.currentUser.uid));
    return get(rf).then(convertACB);

    function convertACB(snapshot) {
        userPersistenceToModel(snapshot.val(), model);
        model.ready = true;
    }
}

export function connectToFirebase(model) {
    reaction(modelChangedACB, storedStateEffectACB);
    onAuthStateChanged(auth, onLoginACB);

    function onLoginACB(user) {
        readUserData(model);
        reaction(userDataChangedACB, saveUserDataACB);
    }

    function userDataChangedACB() {
        return [model.users[auth.currentUser.uid].colorCurrent, model.users[auth.currentUser.uid].favorites, 
                model.users[auth.currentUser.uid].device, model.users[auth.currentUser.uid].profile.bio,
                model.users[auth.currentUser.uid].profile.username]
    }

    function saveUserDataACB() {
        saveUserData(model);
    }

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelChangedACB() {
        return [model.users, model.images, model.screens, model.paringCodes];
    }
}

export default connectToFirebase;

export { app };