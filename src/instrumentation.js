import { observable, configure } from "mobx";
import model from "./pixeModel"
import connectToFirebase from "./firebaseModel"

export async function register() {
    if (process.env.NEXT_RUNTIME === 'nodejs') {
        const reactiveModel = observable(model);
        configure({ enforceActions: "never", });
        connectToFirebase(reactiveModel);
    }
}
