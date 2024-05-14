'use client'

import { observer } from "mobx-react-lite";
import { app } from "/src/firebaseModel.js";
import { useModel } from "../model-provider.js";
import FavouritesView from "./favouritesView.jsx";
import { getDatabase, ref, update, remove } from "firebase/database";
import { ref as storageRef, getDownloadURL, getStorage } from "firebase/storage";

export function downloadImage(url, filename) {
  const storage = getStorage(app);
  const imageRef = storageRef(storage, url);
  console.log(url);
  if(url.startsWith('data:image/')){
      const byteCharacters = atob(url.split(',')[1]);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], {type: 'image/png'});
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(blobUrl); 
  }else{
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
                      URL.revokeObjectURL(blobUrl); 
                  });
          })
          .catch((error) => {
              console.error(error);
          });
  }
}

export function displayImage(id){
  const db = getDatabase(app);
  const dbRef = ref(db, 'pixeModel/screens/pixedemodevice/');
  update(dbRef, {activeImage: id});
}

export default observer(
  function Favourites() {
    const model = useModel();

    function removeFavourite(id) {
      const favArray = [];
      for (const element of model.users[model.user.uid].favorites) {
        if (id === element.id){
          continue;
        }
        favArray.push(element);
      }
      model.users[model.user.uid].favorites = favArray;

      if(favArray.length === 0){
      const db = getDatabase(app);
      const favRef = ref(db, 'pixeModel/users/' + model.user.uid + '/favorites/' + id); 
    
      return remove(favRef)
          .then(() => {
              console.log(`Removed favourite with name: ${id}`);
          })
          .catch((error) => {
              console.error(`Error removing favourite: ${error}`);
          });
      }
    }

    if (!model.userReady || !model.ready) {
      return <div>
               <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
             </div>
    }

    return (
      <FavouritesView
        model={model}
        removeFavourite={removeFavourite}
      />
    );
  }
);

  
