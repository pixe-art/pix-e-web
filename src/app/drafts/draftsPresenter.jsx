'use client'

import { observer } from "mobx-react-lite";
import { app } from "/src/firebaseModel.js";
import { useModel } from "../model-provider.js";
import DraftsView from "./draftsView.jsx";
import { getDatabase, ref} from "firebase/database";
import { ref as storageRef, getDownloadURL, getStorage } from "firebase/storage";
import { TW_center } from "../art-tool/tailwindClasses.js";

export function downloadImage(url, filename) {
    const storage = getStorage(app);
    const imageRef = storageRef(storage, url);
  
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

export default observer(
    function Drafts() {
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

    function addToFavourites(image) {
      const userId = model.user.uid;
      model.users[userId].favorites = [...model.users[userId].favorites, image];
    }

    if (!model.userReady || !model.ready) {
      return <div>
               <img className={TW_center} src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
             </div>
    }

    return (
      <DraftsView
        model={model}
        removeFavourite={removeFavourite}
        addToFavourites={addToFavourites}
      />
    );
  }
    
);