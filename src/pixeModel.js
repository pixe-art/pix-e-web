import { auth } from "./firebaseModel";
const user = auth.currentUser;

export default {
    ready: false,
    users: [],
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
        id: '7',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F7.png?alt=media&token=11725268-faac-4a83-a5c6-9cf6f7a6f34d",
        title: "Walking seal",
        creator: "Some weirdo",
        storage: "gs://pix-e-b9fab.appspot.com/images/7.png",
        lastEdited: "3",
    },
    {
        id: '8',
        testPicture: "https://firebasestorage.googleapis.com/v0/b/pix-e-b9fab.appspot.com/o/images%2F8.png?alt=media&token=1ada47e4-ba8a-47ba-9f2f-1ab673deadd3",
        title: "Some flag idunno",
        creator: "Some weirdo",
        storage: "gs://pix-e-b9fab.appspot.com/images/8.png",
        lastEdited: "3",
    }],
    screens: [],
    paringCodes: [],

    // Add more image objects as needed
};