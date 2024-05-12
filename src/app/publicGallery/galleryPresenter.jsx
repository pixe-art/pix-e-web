'use client'

import { observer } from "mobx-react-lite";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef , set, push, update } from "firebase/database";
import { useModel } from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref as sRef , getDownloadURL, uploadBytesResumable, uploadBytes } from "firebase/storage";
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

export function displayImage(id){
    const db = getDatabase(app);
    const ref = dbRef(db, 'pixeModel/screens/pixedemodevice/');
    update(ref, {activeImage: id});
}

export default observer(
    function Gallery(){
        const model = useModel();
        return <GalleryView model={model} addToFavourites={addToFavourites} downloadImage={downloadImage} />

        function addToFavourites(image) {
            const userId = model.user.uid;
        
            //const imagePath = new URL(imageUrl).pathname.split('/').pop();
            
            // Create a copy of the image in Firebase storage
            const storage = getStorage(app);
            //const imageRef = sRef(storage, imagePath);
            const userImageRef = sRef(storage, 'users/' + userId + '/favorites/' + image.id);
            fetch(image.testPicture).then(response => response.blob()).then(blob => {
                uploadBytes(userImageRef, blob);
            });
        
            const imageCopy = image;
            imageCopy.storage = "gs://pix-e-b9fab.appspot.com/users/" + userId + '/favorites/' + image.id;

            if (model.users[userId].favorites !== undefined)
                model.users[userId].favorites = [...model.users[userId].favorites, imageCopy];

            else
                model.users[userId].favorites = [imageCopy];
        
            // Fetch the image data
            /*fetch(imageUrl)
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
        
                            // Generate Firebase HTTPS link for the image
                            getDownloadURL(userImageRef)
                                .then((url) => {
                                    console.log('Firebase HTTPS link:', url);
        
                                    // Store the reference in the Firebase database
                                    const db = getDatabase(app);
                                    const imageRef = dbRef(db, 'pixeModel/users/' + userId + '/favorites/' + filename);
                                    update(imageRef, {
                                        id: filename, 
                                        testPicture: url, // use the url here
                                        title: filename,
                                        creator: creator,
                                        storage: "gs://pix-e-b9fab.appspot.com/users/" + userId + '/favorites/' + filename
                                    });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }
                    );
                })
                .catch((error) => {
                    console.error(error);
                });*/
        }
    }
);