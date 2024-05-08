'use client'

import { observer } from "mobx-react-lite";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef , set, push, update, remove } from "firebase/database";
import { useModel } from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref as sRef , getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

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

export function addToFavourites(imageUrl, filename, creator, id) {
    return new Promise((resolve, reject) => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;

        const imagePath = new URL(imageUrl).pathname.split('/').pop();
        
        // Create a copy of the image in Firebase storage
        const storage = getStorage(app);
        const imageRef = sRef(storage, imagePath);
        const userImageRef = sRef(storage, 'users/' + userId + '/favourites/' + filename);

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
                        reject(error);
                    }, 
                    () => {
                        console.log('Copied image to user storage');

                        // Generate Firebase HTTPS link for the image
                        getDownloadURL(userImageRef)
                            .then((url) => {
                                console.log('Firebase HTTPS link:', url);

                                // Store the reference in the Firebase database
                                const db = getDatabase(app);
                                const usersRef = dbRef(db, 'pixeModel/users/' + userId + '/favourites/' + filename);
                                update(usersRef, {
                                    id: id, 
                                    testPicture: url, // use the url here
                                    title: filename,
                                    creator: creator,
                                    storage: "gs://pix-e-b9fab.appspot.com/users/" + userId + '/favourites/' + filename,
                                    isFavourite: true
                                });
                                resolve();
                            })
                            .catch((error) => {
                                console.error(error);
                                reject(error);
                            });
                    }
                );
            })
            .catch((error) => {
                console.error(error);
                reject(error);
            });
    });
}

export function removeFavourite(filename) {
    const auth = getAuth();
    const userId = auth.currentUser.uid;
    const db = getDatabase(app);
    const favRef = dbRef(db, 'pixeModel/users/' + userId + '/favourites/' + filename); 
  
    return remove(favRef)
        .then(() => {
            console.log(`Removed favourite with name: ${filename}`);
        })
        .catch((error) => {
            console.error(`Error removing favourite: ${error}`);
        });
}

export function displayImage(id){
    const db = getDatabase(app);
    const ref = dbRef(db, 'pixeModel/screens/pixedemodevice/');
    update(ref, {activeImage: id});
}

export default observer(
    function Gallery(){
        const model = useModel();
        return <GalleryView model={model} addToFavourites={addToFavourites} downloadImage={downloadImage} />
    }
);