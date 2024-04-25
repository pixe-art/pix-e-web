'use client'

import { observer } from "mobx-react-lite";
import images from "/src/pixeModel.js";

import GalleryView from "./galleryView.jsx";

export function downloadImage(imageUrl, imageName) {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = imageName || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

export default observer(
    function Gallery(){
        return <GalleryView images = {images}/>
    }
);