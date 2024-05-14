import { initializeApp } from "firebase/app";
import { getDatabase, push, ref, get, set, onValue, update } from "firebase/database";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { reaction } from "mobx"
import { getStorage } from "firebase/storage";
import firebaseConfig from "/src/firebaseConfig.js"

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
    realtimeModel = {images: toObject(model.images)};
    //Add more properties here like: realtimeModel.color = model.color;

    return realtimeModel;
}

export function userModelToPersistence(model) { 
    let realtimeModel = null;

    function toObject(arr) {
        const obj = {};
        for (const element of arr)
          obj[element.id] = element;
        return obj;
    }

    realtimeModel = {colorCurrent: model.users[model.user.uid].colorCurrent};
    realtimeModel.canvasCurrent = model.users[model.user.uid].canvasCurrent;
    if (model.users[model.user.uid].images?.length)
        realtimeModel.images = toObject(model.users[model.user.uid].images);
    if (model.users[model.user.uid].favorites?.length)
        realtimeModel.favorites = toObject(model.users[model.user.uid].favorites);
    realtimeModel.profile = model.users[model.user.uid].profile;
    if (model.users[model.user.uid].drafts?.length)
        realtimeModel.drafts = toObject(model.users[model.user.uid].drafts);

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

        if (data.screens){
            model.screens = toArray(data.screens);
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
            model.users[model.user.uid].colorCurrent = data.colorCurrent;
        }

        if (data.canvasCurrent){
            model.users[model.user.uid].canvasCurrent = data.canvasCurrent;
        }

        if (data.favorites){
            model.users[model.user.uid].favorites = toArray(data.favorites);
        }

        if (data.drafts){
            model.users[model.user.uid].drafts = toArray(data.drafts);
        }

        if (data.images){
            model.users[model.user.uid].images = toArray(data.images);
        }

        if (data.profile){
            model.users[model.user.uid].profile = data.profile;
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
    const rf = ref(db, (PATH + "/users/" + model.user.uid));

    if (model.userReady) {
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
    model.userReady = false;

    const rf = ref(db, (PATH + "/users/" + model.user.uid));
    return get(rf).then(convertACB);

    function convertACB(snapshot) {
        userPersistenceToModel(snapshot.val(), model);
        model.userReady = true;
    }
}

export function connectToFirebase(model) {
    readFromFirebase(model);
    reaction(modelChangedACB, storedStateEffectACB);
    reaction(modelReadyACB, modelIsReadyACB);
    
    function onLoginACB(user) {
        model.user = user;

        if (user) {
            setDefaults();
            readUserData(model);
            reaction(userDataChangedACB, saveUserDataACB);
        }
    }

    function setDefaults() {
        if (model.users[model.user.uid]) {
            if (model.users[model.user.uid].colorCurrent === undefined) 
                model.users[model.user.uid].colorCurrent = "";

            if (model.users[model.user.uid].canvasCurrent === undefined) 
                model.users[model.user.uid].canvasCurrent = "";

            if (model.users[model.user.uid].favorites === undefined){
                model.users[model.user.uid].favorites = [];
            }

            if (model.users[model.user.uid].drafts === undefined)
                model.users[model.user.uid].drafts = [];

            if (model.users[model.user.uid].images === undefined)
                model.users[model.user.uid].images = [];

            if (model.users[model.user.uid].profile === undefined)
                model.users[model.user.uid].profile = {bio: "", username: "", 
                avatar: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28"};

            else { 
                if (model.users[model.user.uid].profile.bio === undefined)
                    model.users[model.user.uid].profile.bio = "";

                if (model.users[model.user.uid].profile.username === undefined)
                    model.users[model.user.uid].profile.username = "";

                if (model.users[model.user.uid].profile.avatar === undefined)
                    model.users[model.user.uid].profile.avatar = "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28";
            }

            
        }

        else {
            model.users[model.user.uid] = {colorCurrent: ""};
            model.users[model.user.uid].canvasCurrent = "";
            model.users[model.user.uid].favorites = [];
            model.users[model.user.uid].drafts = [];
            model.users[model.user.uid].images = [];
            model.users[model.user.uid].profile = {bio: "", username: "", 
            avatar: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/avatars%2Fdefault.png?alt=media&token=39e999d9-aed3-4e95-a9dc-5a96ae3d7e28"};
        }
    }

    function userDataChangedACB() {
        return [model.users[model.user.uid].colorCurrent, model.users[model.user.uid].canvasCurrent, 
                model.users[model.user.uid].favorites, model.users[model.user.uid].images,
                model.users[model.user.uid].profile.bio,
                model.users[model.user.uid].profile.username, model.users[model.user.uid].profile.avatar,
                model.users[model.user.uid].drafts];
    }

    function saveUserDataACB() {
        saveUserData(model);
    }

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    function modelIsReadyACB() {
        if (model.ready) {
            onAuthStateChanged(auth, onLoginACB);
        }
    }

    function modelChangedACB() {
        return [model.images];
    }

    function modelReadyACB() {
        return [model.ready];
    }
}

export default connectToFirebase;

export { app };