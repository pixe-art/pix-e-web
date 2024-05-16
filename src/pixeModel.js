import { auth } from "./firebaseModel";
const user = auth.currentUser;

export default {
    ready: false,
    userReady: false,
    users: {},
    images: [],
    screens: [],
    pairingCodes: [],
    // canvasCurrent: "",

    // Add more image objects as needed
};