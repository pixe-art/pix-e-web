import "./artToolStyles.css";
import React, { useState, useEffect } from 'react';
const testCSS = "bg-yellow-100 border border-red-600  w-2/4 h-2/4 left-1/4 top-1/4 z-30 "

function Save(props) {
    const [image, setImage] = useState();

    return(
        <div id="draft-parent" className={testCSS + " absolute text-black flex flex-col items-center"}>
            <h1 className="text-center text-4xl font-bold m-4">YOUR DRAFTS</h1>
            <div id="draft-images" className="grid grid-cols-3 gap-6 draft-images-container">
                {Object.values(props.model.users[props.userID].drafts).map(renderImages)}
            </div>
        </div>
    )
    function renderImages(img) {
        return (
            <div className="flex flex-col items-center w-40 h-auto mb-4 img-hover-effect" onClick={() => handleImgClick(img)}>
                <img key={img.id} src={img.testPicture} alt="" className="w-full h-auto mb-2" />
                <div className="text-center w-full">
                <p className="break-words" title={`${img.title} Created by: ${img.creator}`}>
                    {img.title}<br />Created by: {img.creator}
                </p>
                </div>
            </div>
        ) 

        function handleImgClick(img) {
            setImage(img);
            //props.overwriteCanvas(img.testPicture);
            
        }
    }
}
export default Draft