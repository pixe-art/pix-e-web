'use client'

import { observer } from "mobx-react-lite";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef , set } from "firebase/database";
import { useModel } from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref as sRef , getDownloadURL, uploadBytesResumable } from "firebase/storage";

import GalleryView from "./galleryView.jsx";

export function downloadImage(url, filename) {
    const storage = getStorage(app);
    const imageRef = sRef(storage, url);

    getDownloadURL(imageRef)
        .then((downloadURL) => {
            console.log('File available at', downloadURL);
            fetch(downloadURL)
                .then(response => response.blob())
                .then(blob => {
                    const blobUrl = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = blobUrl;
                    a.download = filename;
                    a.click();
                    URL.revokeObjectURL(blobUrl); // clean up
                });
        })
        .catch((error) => {
            console.error(error);
        });
}

export function addToFavourites(imageUrl, filename) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    const imagePath = new URL(imageUrl).pathname.split('/').pop();
    
    // Create a copy of the image in Firebase storage
    const storage = getStorage(app);
    const imageRef = sRef(storage, imagePath);
    const userImageRef = sRef(storage, 'user/' + userId + '/' + filename);

    console.log(imagePath);
    // Fetch the image data
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            // Upload the image data to the new path
            const uploadTask = uploadBytesResumable(userImageRef, blob);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle the upload progress
                }, 
                (error) => {
                    console.error(error);
                }, 
                () => {
                    console.log('Copied image to user storage');

                    // Store the reference in the Firebase database
                    const db = getDatabase(app);
                    console.log(filename);
                    console.log(imagePath);
                    set(dbRef(db, 'user/' + userId + '/favourites/' + filename), imagePath);
                    //set(ref(db, 'testPath'), 'testValue');
                }
            );
        })
        .catch((error) => {
            console.error(error);
        });
}
/*
export function addToFavourites(imageUrl, filename) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;

    // Create a copy of the image in Firebase storage
    const storage = getStorage(app);
    const imageRef = storageRef(storage, imageUrl);
    const userImageRef = storageRef(storage, 'user/' + userId + '/' + filename);

    // Fetch the image data
    fetch(imageUrl)
        .then(response => response.blob())
        .then(blob => {
            // Upload the image data to the new path
            const uploadTask = uploadBytesResumable(userImageRef, blob);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    // Handle the upload progress
                }, 
                (error) => {
                    console.error(error);
                }, 
                () => {
                    console.log('Copied image to user storage');
                }
            );
        })
        .catch((error) => {
            console.error(error);
        });
}
*/

export default observer(
    function Gallery(){
        const model = useModel();
        return <GalleryView model={model} addToFavourites={addToFavourites} downloadImage={downloadImage} />
    }
);