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

    function storedStateEffectACB() {
        saveToFirebase(model);
    }

    // How to save and read model properties to and from firebase. Also how to change the model from views.
    // First create a new property in the pixeModel.js like:" color: "black" ".
    // Add the model property in the array below that you want to save to the realtime database here like: model.color.
    // Go to functions modelToPersistance and persistanceToModel in this file and read the comments.
    // Import the useModel() function from model-provider.js in your presenter and define a const model.
    // Like: const model = useModel().
    // Pass the model as a prop to the view.
    // Change the model in the view by changing props.model.somePropertyOfTheModel
    // Note that the view must have the parameter "props" in this case.
    function modelChangedACB() {
        return [model.testText, model.pictures];
    }
}

export default connectToFirebase;

export { app };