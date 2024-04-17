'use client'

import { observer } from "mobx-react-lite";

import MyGalleryView from "./myGalleryView.jsx";

export default observer(
    function MyGallery(){
        return <MyGalleryView/>
    }
);