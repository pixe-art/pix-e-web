'use client'

import { observer } from "mobx-react-lite";

import GalleryView from "./galleryView.jsx";

export default observer(
    function Gallery(){
        return <GalleryView />
    }
);