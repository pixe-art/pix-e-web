'use client'

import { observer } from "mobx-react-lite";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef , set, push, update, remove } from "firebase/database";
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
        if (!model.userReady || !model.ready) {
            return <div>
                     <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
                   </div>
        }

        return <GalleryView model={model} addToFavourites={addToFavourites} removeFavourite={removeFavourite} downloadImage={downloadImage} />

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
    
        }

        function removeFavourite(id) {
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            const db = getDatabase(app);
            const favRef = dbRef(db, 'pixeModel/users/' + userId + '/favorites/' + id); 
          
            return remove(favRef)
                .then(() => {
                    console.log(`Removed favourite with name: ${id}`);
                })
                .catch((error) => {
                    console.error(`Error removing favourite: ${error}`);
            });
        }
});