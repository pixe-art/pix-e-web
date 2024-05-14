'use client'

import { observer } from "mobx-react-lite";
import { getAuth } from "firebase/auth";
import { getDatabase, ref as dbRef , set, push, update } from "firebase/database";
import { useModel } from "/src/app/model-provider.js";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref as sRef , getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 as uuidv4 } from 'uuid';

import GalleryView from "./pairView.jsx";
import PairView from "./pairView.jsx";

export default observer(
    function Pair(){
        const model = useModel();
        return <PairView model={model} />
    }
);