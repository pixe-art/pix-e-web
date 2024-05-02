'use client'

import { observer } from "mobx-react-lite";
import {useModel} from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref, getDownloadURL } from "firebase/storage";

import MyGalleryView from "./myGalleryView.jsx";

export function downloadImage(url, filename) {
    const storage = getStorage(app);
    const imageRef = ref(storage, url);

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
    function MyGallery(){
        const model = useModel();
        return <MyGalleryView model = {model}/>
    }
);