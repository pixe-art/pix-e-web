// Alvin
import "../globals.css"
import "./artToolStyles.css"
import { getCords } from "@/utilities";
import { React, useEffect, useState } from "react";
import { SketchPicker } from 'react-color';
import Draggable from './draggable';
import Draft from "./draft";

let init = true
const toolButtonCSS = "transition-color bg-white border border-brown text-black select-none my-0 w-96 md:rounded-lg md:hover:bg-gray-200 md:w-auto md:my-2 hmd:md:my-0.5 md:hover:text-black "
const toolActiveButtonCSS = " active:text-white active:bg-gray-200 md:active:text-white md:active:bg-gray-400  "

function ArtTool(props) {
    const [isMounted, setIsMounted] = useState(false);
    const [draftUpdate, setDraftUpdate] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {    
            if (init){
                //overwriteCanvas(props.model.canvasCurrent.testPicture);
                init = false
            }
        }
    
    }, [isMounted]);


    useEffect(() => {
        // console.log("useEffect called");
        if(draftUpdate) {
            // console.log("draftUpdate true");
            setDraftUpdate(false);
        }
    }, [draftUpdate]);

    return( 
        <div>{isMounted &&
            <div id="parent" className="inset-0 bg-cover bg-cream touch-none max-h-screen overflow-hidden" onMouseUp={mouseUp}>
                <div id="topbar" className="hidden align-middle bg-brown text-pretty justify-center py-2 md:flex hmd:hidden">
                    <div>
                    <a href="/dashboard/" className="mx-2">Home</a>
                </div>
                <div id="instrutions" className="flex justify-center w-screen self-center text-center *:mx-1 *:px-1 flex-row">
                        <h1>Left-Click to draw</h1>
                        <h1>Right-Click to erase</h1>
                        <h1>Middle-Click to place a single pixel</h1>
                        <button id="debug" className="mx-2 border rounded max-w-fit self-center" onClick={debugEvent} type="button">Click here for debug info</button>
                    </div>
                </div>
                <div id="draft" className="hidden">
                    <Draft  model = {props.model} overwriteCanvas = {overwriteCanvas}>
                    </Draft>
                </div>
                <div id="content" className="h-screen flex flex-col md:flex-row justify-between items-center mx-4" onMouseDown={closeDraft} onTouchStart={closeDraft}>
                    <div id="color-picker" className="">
                            <div className="flex flex-col items-center justify-center">
                                    <div id="sketch-picker" style={{ display: '' }} className="self-center">
                                        <SketchPicker color={props.color} onChangeComplete={colorChangeEvent} className="self-center hidden md:flex md:flex-col"/>
                                    </div>
                            </div>
                        </div>
                    <div>
                        <canvas className="canvas transition-colors cursor-crosshair select-none touch-none bg-white border border-brown shadow-md" id="drawing-area" width="64" height="32" onContextMenu={(event)=>{event.preventDefault()}}
                            onTouchStart={touchDrawEvent} onMouseDown={mouseClickEvent}  onMouseMove={mouseDragEvent} onMouseLeave={resetLastCoords} onTouchMove={touchDragEvent}/>
                    </div>
                    <div id="tools" className="mt-0 hmd:mt-20 grid hmd:md:mt-0 hmd:md:ml-4 md:flex md:flex-col items-stretch">
                        <button id="show-draft" className={toolButtonCSS + toolActiveButtonCSS + "w-auto"} onClick={toggleDraft}>Draft Menu</button>
                        <button id="save" className={toolButtonCSS + toolActiveButtonCSS} onClick={uploadToFirebase}>Save</button>
                        <button id="download" className={toolButtonCSS + toolActiveButtonCSS} onClick={props.downloadCanvas} type="button">Download</button>
                        <button id="bg" className={toolButtonCSS + toolActiveButtonCSS} onClick={toggleBg}>Background Color</button>
                        <div className="select-none cursor-default hmd:hidden">&nbsp;</div>
                        <button id="erase" className={toolButtonCSS + toolActiveButtonCSS} onClick={toggleEraser}>Eraser</button>
                        <button id="undo" className={toolButtonCSS + toolActiveButtonCSS} onClick={undo}>Undo</button>
                        <button id="redo" className={toolButtonCSS + toolActiveButtonCSS} onClick={redo}>Redo</button>
                        <button id="clear" className={toolButtonCSS + toolActiveButtonCSS} onClick={clearCanvas} type="button">Clear</button>
                        <p className="text-black text-center font-extrabold md:hidden">Select Color</p>
                        <input id="color-d" className="min-w-full bg-white cursor-default rounded-lg md:pointer-events-none" type="color" title="Selected Color" name="" value={props.color} onChange={colorChangeEvent}/>
                        <div className="text-black my-2 ">
                            <div className="flex flex-row">
                                <p>Pen Size:</p>
                                <p>&nbsp;</p>                            
                                <p id="pen-size-d">1</p>                            
                            </div>
                            <input type="range" name="pen-size" id="pen-size" className="cursor-w-resize w-96 md:w-auto" defaultValue={props.changePenSize()} min={"1"} max={"12"} onChange={penSizeEvent}/>
                        </div>
                    </div>
                    <div id="bottom-spacing" className="min-h-10 md:hidden"></div>
                </div>

            </div>
        }</div>
    );
    function mouseUp() {
        props.checkReset(false)
    }
    function closeDraft() {
        const draft = document.getElementById("draft").classList; 
        if (!draft.contains("hidden"))
            draft.toggle("hidden");
    }
    function paletteButtonClick() {
        let style = document.getElementById("sketch-picker").style
        if (style.visibility === "hidden") {
            style.visibility = "visible";
        }else {
            style.visibility = "hidden";
        }
    }
    function toggleBg(event){
        const canv = document.getElementById("drawing-area");
        canv.classList.toggle("bg-white")
        canv.classList.toggle("bg-black")
        const element = document.getElementById(event.target.id)
        element.classList.toggle("bg-gray-300")
        element.classList.toggle("bg-white")
        // element.classList.toggle("text-black")
        element.classList.toggle('md:hover:text-black')
        element.classList.toggle('md:hover:bg-gray-200')
    }

    function colorChangeEvent(event) {
        const colorDisplay = document.getElementById("color-d");
        const newColor = event?.hex || event.target?.value;
        const colorVar = props.handleColorChange(newColor);
        colorDisplay.value = colorVar;  // Update the UI element showing the color
    }
    function debugEvent() {
        //! log outputs for checking canvas size
        const element = document.getElementById("drawing-area");
        props.printDebugInfo(element)
    }

    function toggleDraft(event) {
        const element = document.getElementById("draft");
        element.classList.toggle("hidden");
    }
    function uploadToFirebase() {
        console.warn("attempting to upload...");
        const element = document.getElementById("drawing-area")
        console.log("element: ", element);
        if (!props.isCanvasEmpty(element)) {
            props.uploadToFirebase(element);
            setDraftUpdate(true);
        } else {
            console.log("Cannot save an empty canvas");
        }
    }
    function saveCurrent() {
        // saves current canvas history to undo history 
        const element = document.getElementById("drawing-area");
        props.unshiftUndoHistory(element)     
    }
    function clearCanvas() {
        const element = document.getElementById("drawing-area")
        props.unshiftUndoHistory(element)
        props.clearRedoHistory()
        props.clearCanvas()
    }
    function overwriteCanvas(source) {
        // overwrites canvas with an img url
        console.log("overwriteCanvas source: ", source);
        const draftClass = document.getElementById("draft").classList
        if (!draftClass.contains("hidden")) {
            draftClass.toggle("hidden")
        }
        const element = document.getElementById("drawing-area");
        const extra = element.getContext("2d")
        let img = new Image()
        img.crossOrigin = "anonymous";
        img.src = source;
        img.onload = () => {
            if (img.width !== element.width || img.height !== element.height) {
                console.error("Preventing Canvas overwrite due to img with incorrect dimensions (" + img.width + "x" + img.height + ")\n"
                + "\tImg should be equal to Canvas (" + element.width + "x" + element.height + ")");
                return;
            }
            props.clearCanvas();
            extra.drawImage(img, 0, 0);
            img.remove();
        }
    }
    function undo() {
        // grabs and replaces canvas with last image in undo history 
        const last = props.grabLastImage()
        if (last) {
            const element = document.getElementById("drawing-area");
            props.unshiftRedoHistory(element)
            overwriteCanvas(last)
        }
    }
    function redo() {
        const last = props.restoreLastImage()
        if (last) {
            saveCurrent()
            overwriteCanvas(last)
        }
    }
    function toggleEraser(event) {
        const element = document.getElementById(event.target.id);
        const ebg = element.classList.toggle('bg-gray-300')
        element.classList.toggle("bg-white")
        // element.classList.toggle("text-black")
        element.classList.toggle('md:hover:text-black')
        element.classList.toggle('md:hover:bg-gray-200')
        props.eraserToggle(ebg)
    }
    function penSizeEvent(event) {
        document.getElementById("pen-size-d").innerHTML = props.changePenSize(event.target.value);
    }

    function resetLastCoords(){
        props.setLastCords([-1, -1]);
    }
    function mouseClickEvent(event) {
        event.preventDefault();
        // save current canvas state in undoHistory
        saveCurrent();
        props.checkReset(true)
        const element = document.getElementById(event.target.id);
        //* translate event coordiantes to the canvas 
        const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);
        const con = element.getContext("2d");

        if (event.button === 2 && !props.eraser) {
            //* right click erase
            props.eraserToggle(true)
            props.drawRect(cords[0], cords[1], con)
            props.eraserToggle(false)
        } else { 
            //* regualr draw
            props.drawRect(cords[0], cords[1], con)
        }
        // save cords for fallback in mouseDragEvent, prevents gaps in fast movements
        props.setLastCords(cords); 
    }

    function mouseDragEvent(event) {
        const canvas = document.getElementById("drawing-area");
        const xy = getCords(canvas, event.clientX, event.clientY, (props.penSize - 1) / 2);
        if ((event.buttons === 1 || event.buttons === 2) && props.checkReset()) {
            if (props.lastXY[0] === -1 && props.lastXY[1] === -1) {
                props.setLastCords(xy);  // Update without drawing if last coordinates were invalid
            } else if (event.buttons === 2 && !props.eraser) {
                //* right click erase
                props.eraserToggle(true)
                props.drawLine(canvas, xy[0], xy[1]);
                props.eraserToggle(false)
            } else {
                //* regular draw
                props.drawLine(canvas, xy[0], xy[1]);
            }
        }
    }
        
    function touchDrawEvent(event){
        const element = document.getElementById(event.target.id);
        const touch = event.targetTouches[0];
        const xy = getCords(element, touch.clientX, touch.clientY, (props.penSize - 1) / 2);
        saveCurrent();
        props.setLastCords(xy); 
    }

    function touchDragEvent(event) {
        const element = document.getElementById(event.target.id);
        const touch = event.targetTouches[0];
        const xy = getCords(element, touch.clientX, touch.clientY, (props.penSize - 1) / 2);
        if (props.lastXY[0] === -1 && props.lastXY[1] === -1) {
            props.setLastCords(xy);  // Update without drawing if last coordinates were invalid
        } else {
            props.drawLine(element, xy[0], xy[1]);
        }
    }
}
export default ArtTool;