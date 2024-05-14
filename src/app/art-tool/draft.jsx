import "./artToolStyles.css";
import React, { useState, useEffect } from 'react';
//const testCSS = " top-[15%] left-[12.5%] w-[75%] h-[75%] z-30 "
const testCSS = "bg-gray-100 border border-black w-2/4 h-2/4 left-1/4 top-1/4 z-30";

import { TW_centered, TW_titleText, TW_window } from "./tailwindClasses";

function Draft(props) {
    const [selectedImage, setSelectedImage] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false);
    const [boxAction, setBoxAction] = useState(null);
    const [draftExists, setDraftExists] = useState(false);

    useEffect(() => {
        if (props.model.users[props.model.user.uid]?.drafts || false) {
            setDraftExists(true);
        }
    }, [props.model.users[props.model.user.uid]?.drafts]);

    function closeBox() {
        setBoxOpen(false);
    }

    function confirmBoxAction() {
        if (boxAction === "edit") {
            editClick();
        } else if (boxAction === "delete") {
            deleteClick();
        }
        closeBox();
        if (boxAction === "edit") {
            props.toggleDraft("draft");
        }
    }

    function openBox(action) {
        setBoxAction(action);
        setBoxOpen(true);
    }

    function editClick() {
        console.log("editClick");
        if (!selectedImage) {
            console.log("Choose an image to edit");
        return;
        }
        props.overwriteCanvas(selectedImage.testPicture);
        props.persistCanvas(selectedImage.testPicture)
        setSelectedImage(false);
    }

    function deleteClick() {
        console.log("deleteClick");
        if (!selectedImage) {
            console.log("Choose an image to delete");
        return;
        }
        props.deleteDraft(selectedImage);
        setSelectedImage(false);
    }

    if (!draftExists) {
        console.warn("draftExists = ", draftExists);
        return <div></div>
    }
    return(
        <div>
            <div id="draft-parent" className={TW_centered + TW_window + "flex flex-col items-center"}>
                <h1 className="text-center text-4xl font-bold m-4">YOUR DRAFTS</h1>
                <div id="draft-images" className="grid grid-cols-3 gap-6 draft-images-container">
                    {props.model.users[props.model.user.uid].drafts.map(renderImages)}
                </div>
                <div className="draft-buttons grid grid-cols-2 gap-4 w-full">
                    <button 
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ease-in-out ${selectedImage ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                        disabled={!selectedImage}
                        onClick={() => openBox('edit')}
                    >
                        Edit
                    </button>
                    <button
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ease-in-out ${selectedImage ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                        disabled={!selectedImage}
                        onClick={() => openBox('delete')}
                    >
                        Delete
                    </button>
                </div>
                {boxOpen && (
                    <ConfirmationBox closeBox={closeBox} confirmBoxAction={confirmBoxAction} action={boxAction}/>
                )}
            </div>
        </div>
    )

    function renderImages(img) {
        const isSelected = selectedImage && img.id === selectedImage.id;
        return (
            <div key={img.id} className={`flex flex-col items-center w-full h-auto mb-4 img-hover-effect ${isSelected ? 'selected-image' : ''}`} onClick={() => imgClick(img)}>
                <img src={img.testPicture} alt="" className="w-full mb-2 image-pixelated" />
                <div className="text-center w-full">
                <p className="break-words" title={`${img.title} Created by: ${img.creator}`}>
                    {img.title}<br /> Created by: {img.creator}
                </p>
                </div>
            </div>
        ) 

        function imgClick(img) {
            if (selectedImage.testPicture !== img.testPicture) {
                setSelectedImage(img);
            } else {
                setSelectedImage(false);
            }
            //props.overwriteCanvas(img.testPicture);
            console.log(selectedImage);
            
        }

    }
}

function ConfirmationBox({ closeBox, confirmBoxAction, action }) {
    return (
        <div className="box-background">
            <div className="box-container">
                <h2>Are you sure you want to {action} this image?</h2>
                <div className="button-container">
                    <button className="box-button" onClick={confirmBoxAction}>Yes</button>
                    <button className="box-button" onClick={closeBox}>No</button>
                </div>
            </div>
        </div>
    );
}
export default Draft