'use client'

import { observer } from "mobx-react-lite";
import { useState, useEffect } from 'react';
import MyGalleryView from "./myGalleryView.jsx";
import {connectToFirebase, saveToFirebase, readFromFirebase} from "@/firebaseModel.js";

function MyGallery() {
  const [model, setModel] = useState({
    ready: false,
    testPicture: null,
    pictures: [],
  });

  useEffect(() => {
    connectToFirebase(model);
  }, []);

const savePicture = () => {
    // Update the model state using setModel
    setModel(prevModel => {
        const updatedModel = {
            ...prevModel,
            testPicture: prevModel.testPicture
        };

        // Save the updated model to Firebase
        saveToFirebase(updatedModel);

        return updatedModel;
    });
}

const loadGallery = () => {
    readFromFirebase(model).then(data => {
        setModel(prevModel => ({
            ...prevModel,
            pictures: data,
        }));
    });
}



return <MyGalleryView savePicture={savePicture} loadGallery={loadGallery} pictures={model.pictures} />
}

export default observer(MyGallery);