import "./artToolStyles.css";
import React, { useState, useEffect } from 'react';
const testCSS = "bg-yellow-100 border border-red-600  w-2/4 h-2/4 left-1/4 top-1/4 z-30 "

function Draft(props) {
    const [selectedImage, setSelectedImage] = useState(false);
    const [boxOpen, setBoxOpen] = useState(false);
    const [boxAction, setBoxAction] = useState(null);

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

    return(
        <div id="draft-parent" className={testCSS + " absolute text-black flex flex-col items-center"}>
            <h1 className="text-center text-4xl font-bold m-4">YOUR DRAFTS</h1>
            <div id="draft-images" className="grid grid-cols-3 gap-6 draft-images-container">
                {Object.values(props.model.users[props.userID].drafts).map(renderImages)}
            </div>
            <div className="draft-buttons grid grid-cols-2 gap-4 w-full">
                <button 
                className={`px-4 py-2 ${selectedImage ? 'bg-blue-500 hover:bg-blue-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
                disabled={!selectedImage}
                onClick={() => openBox('edit')}
                >
                    Edit
                </button>
                <button
                    className={`px-4 py-2 ${selectedImage ? 'bg-red-500 hover:bg-red-700 text-white' : 'bg-gray-400 text-gray-700 cursor-not-allowed'}`}
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
    )
    function renderImages(img) {
        return (
            <div className="flex flex-col items-center w-40 h-auto mb-4 img-hover-effect" onClick={() => imgClick(img)}>
                <img key={img.id} src={img.testPicture} alt="" className="w-full h-auto mb-2" />
                <div className="text-center w-full">
                <p className="break-words" title={`${img.title} Created by: ${img.creator}`}>
                    {img.title}<br />Created by: {img.creator}
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