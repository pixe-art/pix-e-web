import { auth } from "./firebaseModel";
const user = auth.currentUser;

export default {
    ready: false,
    userReady: false,
    images:
    [{
        id: '0',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F0.png?alt=media&token=a072e11d-6c25-44f5-a82a-f35719120b4d",
        title: "Home",
        creator: "John Wick",
        storage: "gs://pix-e-b9fab.appspot.com/images/0.png",
        lastEdited: "1",
    },
    {
        id: '1',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F1.png?alt=media&token=ab259418-100d-4723-87e9-d307e56e4824",
        title: "Night",
        creator: "Barabara Streisand",
        storage: "gs://pix-e-b9fab.appspot.com/images/1.png",
        lastEdited: "2",
    },
    {
        id: '2',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F2.png?alt=media&token=5a3028c1-b71f-46dc-bca2-8b9b35e2df8d",
        title: "Day",
        creator: "Bob",
        storage: "gs://pix-e-b9fab.appspot.com/images/2.png",
        lastEdited: "3",
    },
    {
        id: '3',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F3.png?alt=media&token=a5d92c8b-a90e-438d-96da-a2ccd160b3d8",
        title: "Blue",
        creator: "Blueman group",
        storage: "gs://pix-e-b9fab.appspot.com/images/3.png",
        lastEdited: "1",
    },
    {
          id: '4',
          testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F4.png?alt=media&token=265e8c66-32bd-4063-a6c9-fb4acee3c1ce",
          title: "Car",
          creator: "Mulle Meck",
          storage: "gs://pix-e-b9fab.appspot.com/images/4.png",
          lastEdited: "0",
    },
    {
        id: '5',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F5.png?alt=media&token=aa72a902-2c22-4196-b930-4dd5dd67eb0b",
        title: "Green",
        creator: "Lepi the Leprechaun",
        storage: "gs://pix-e-b9fab.appspot.com/images/5.png",
        lastEdited: "2",
    },
    {
        id: '6',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F6.png?alt=media&token=26287cc2-e5ce-4aeb-a8d7-7dabed0a9e42",
        title: "Red",
        creator: "Soviet Onion",
        storage: "gs://pix-e-b9fab.appspot.com/images/6.png",
        lastEdited: "3",
    },
    {
        id: 'walking_seal',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2Fwalking_seal.png?alt=media&token=ea3fd3c6-cbab-460f-909c-43ee9af309d6",
        title: "Walking seal",
        creator: "Some weirdo",
        storage: "gs://pix-e-b9fab.appspot.com/images/walking_seal.png",
        lastEdited: "3",
    },
    {
        id: 'rgb',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2Frgb.png?alt=media&token=43222a04-f763-4bb6-9f71-0f467714aa6b",
        title: "Some flag idunno",
        creator: "Some weirdo",
        storage: "gs://pix-e-b9fab.appspot.com/images/rgb.png",
        lastEdited: "3",
    }],
    screens: [],
    pairingCodes: [],
    canvasCurrent: "",

    // Add more image objects as needed
};