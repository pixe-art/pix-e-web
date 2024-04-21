'use client'

import { observer } from "mobx-react-lite";
import images from "/src/pixeModel.js";

import GalleryView from "./galleryView.jsx";

export default observer(
    function Gallery(){
        return <GalleryView images = {images}/>
    }
);