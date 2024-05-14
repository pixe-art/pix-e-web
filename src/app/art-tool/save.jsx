import { useEffect, useState } from "react";
import { TW_button, TW_button_green, TW_button_red, TW_button_yellow, TW_centered, TW_titleText, TW_window } from "./tailwindClasses";

export default function SaveMenu(props) {
    const [title, setTitle] = useState("")
    const [publicCheck, setPublicCheck] = useState(false)

    return (
    <div id="save-parent" className={TW_window + TW_centered + "flex flex-col items-center justify-center"}>
            <div className="w-full flex flex-col items-center my-4">
                <p className={TW_titleText + "mb-4"}>Save</p>
                <img id="preview" src={"https://placehold.co/64x32?text=No+Image+Found"} alt="" width={"40%"} className="image-pixelated border-4 border-brown bg-black"/>
                <button onClick={toggleBg} className="">Change Background</button>
            </div>
            <div className="my-4 flex flex-col">
                <p>Enter the title of your art:</p>
                <input id="give-title" type="text" className="w-full px-1 bg-white border rounded border-brown text-black disabled:bg-gray-300 disabled:cursor-not-allowed disabled:border-black" onChange={handleTitleInput}/>
                <p>{"by: " + props.user}</p>
                <div className="min-h-8"></div>
                <div id="make-public-parent" className="flex self-center min-h-8 align-baseline">
                    <label htmlFor="public" className="text-black mx-2 self-center disabled:cursor-not-allowed">Make public</label>
                    <input type="checkbox" name="Public" id="public" className="min-w-4 min-h-4 disabled:bg-slate-700 disabled:cursor-not-allowed" onChange={toggleCheck} />
                </div>
                <button id="save-image" className={TW_button + TW_button_green + "min-w-[20%] min-h-8 !text-white disabled:bg-slate-700 disabled:hover:bg-slate-700 disabled:!text-gray-300 disabled:cursor-not-allowed"} value="private" disabled={false} onClick={test}>Save Image</button>
            </div>
    </div>
    );

    function toggleCheck() {
        setPublicCheck(!publicCheck)
    }
    
    function toggleBg() {
        document.getElementById("preview").classList.toggle("!bg-white")
    }
    function handleTitleInput(event) {
        setTitle(event.target.value)
    }
    function test(event) {
        console.log(event);
        console.log(event.target);
        console.log(document.getElementById("public"));
        console.log(publicCheck);
    }
    function uploadToFirebase(event) {
        console.warn("attempting to upload...");
        const element = document.getElementById("drawing-area")
        console.log("element: ", element);
        if (!props.isCanvasEmpty(element)) {
            const bool = event.target.value ;
            props.uploadToFirebase(element, title, bool);
            props.setDraftUpdate(true);
            props.closeMenu();
            setTitle("");
        } else {
            console.log("Cannot save an empty canvas");
        }
    }
}