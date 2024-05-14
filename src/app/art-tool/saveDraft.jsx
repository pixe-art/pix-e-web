import { useEffect, useState } from "react";
import { TW_button, TW_button_green, TW_button_red, TW_button_yellow, TW_centered, TW_titleText, TW_window } from "./tailwindClasses";

export default function SaveDraft(props) {
    const [title, setTitle] = useState("")
    
    return (
    <div id="save-parent" className={TW_window + TW_centered + "flex flex-col items-center justify-center"}>
            <div className="w-full flex flex-col items-center my-4">
                <p className={TW_titleText + "mb-4"}>Save Draft</p>
                <img id="draft-preview" src={"https://placehold.co/64x32?text=No+Image+Found"} alt="" width={"40%"} className="image-pixelated border-4 border-brown bg-black"/>
                <button onClick={toggleBg} className="">Change Background</button>
            </div>
            <div className="my-4 flex flex-col">
                <p>Enter the title of your draft:</p>
                <input id="give-title" type="text" className="w-full px-1 bg-white border rounded border-brown text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-black" onChange={handleTitleInput}/>
                <p>{"by: " + props.user}</p>
                <div className="min-h-8"></div>
                <button id="save-draft" disabled={false} onClick={saveDraft}
                className={TW_button + TW_button_green + "min-w-[20%] min-h-8 !text-white disabled:bg-slate-700 " + 
                " disabled:hover:bg-slate-700 disabled:!text-gray-300 disabled:cursor-not-allowed"}>Save draft</button>
            </div>
    </div>
    );

    
    function toggleBg() {
        document.getElementById("draft-preview").classList.toggle("!bg-white")
    }
    function handleTitleInput(event) {
        setTitle(event.target.value)
    }

    function saveDraft(event) {
        console.warn("attempting to upload...");
        const element = document.getElementById("drawing-area")
        console.log("element: ", element);
        console.log("saveDraft props: ", props.addToDrafts);

        if (!props.isCanvasEmpty(element)) {
            const success = props.addToDrafts(element, title);

            if (!success) {
                window.alert("Artwork couldn't be saved.\nPlease check if it's already been saved or if the Canvas is empty.")
            } else {
                // functions for only non-published artworks: 
                window.alert("Artwork saved to your drafts!")
            }
            //props.setDraftUpdate(true);
            props.closeMenus();
            setTitle("");
        } else {
            console.log("Cannot save an empty canvas");
        }
    }
}