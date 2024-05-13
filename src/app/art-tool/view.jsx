// Alvin
import "../globals.css"
import "./artToolStyles.css"
import { getCords } from "@/utilities";
import { React, useEffect, useState } from "react";
import { SketchPicker } from 'react-color';
import Draft from "./draft";
import SaveMenu from "./save";
import { TW_button, TW_button_plain, TW_button_plainA } from "./tailwindClasses";

function ArtTool(props) {
    const [isMounted, setIsMounted] = useState(false);
    const [draftUpdate, setDraftUpdate] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {    
            overwriteCanvas(props.model.users[props.model.user.uid].canvasCurrent);
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
                <div id="save" className="hidden">
                    <SaveMenu user={props.model.user.uid} isCanvasEmpty={props.isCanvasEmpty} uploadToFirebase={props.uploadToFirebase} setDraftUpdate={setDraftUpdate} closeMenu={closeMenus}></SaveMenu>
                </div>
                <div id="content" className="h-screen flex flex-col md:flex-row justify-between items-center mx-4" onMouseDown={closeMenus} onTouchStart={closeMenus}>
                    <div id="color-picker" className="">
                            <div className="flex flex-col items-center justify-center">
                                    <div id="sketch-picker" style={{ display: '' }} className="self-center">
                                        <SketchPicker color={props.color} onChange={colorChangeEvent} className="self-center hidden md:flex md:flex-col"/>
                                    </div>
                            </div>
                        </div>
                    <div>
                        <canvas className="canvas transition-colors cursor-crosshair select-none touch-none bg-white border border-brown shadow-md" id="drawing-area" width="64" height="32" onContextMenu={(event)=>{event.preventDefault()}}
                            onTouchStart={touchDrawEvent} onMouseDown={mouseClickEvent}  onMouseMove={mouseDragEvent} onMouseLeave={resetLastCoords} onTouchMove={touchDragEvent}/>
                    </div>
                    <div id="tools" className="mt-0 hmd:mt-20 grid hmd:md:mt-0 hmd:md:ml-4 md:flex md:flex-col items-stretch">
                        <form action="" className="flex flex-col *:m-0 *:p-0 *:y-0" onChange={handleSubmit}>
                            <label htmlFor="upload" className={TW_button + TW_button_plain + TW_button_plainA + "text-center"}>Upload Image</label>
                            <input id="upload" className="hidden" type="file" name="img" accept="image/*" />
                        </form>
                        <button id="show-draft" className={TW_button + TW_button_plain + TW_button_plainA + "w-auto"} value={"draft"} onClick={toggleMenu}>Draft Menu</button>
                        <button id="show-save" className={TW_button + TW_button_plain + TW_button_plainA + "w-auto"} value={"save"} onClick={toggleMenu}>Save</button>
                        <button id="download" className={TW_button + TW_button_plain + TW_button_plainA} onClick={props.downloadCanvas} type="button">Download</button>
                        <button id="bg" className={TW_button + TW_button_plain + TW_button_plainA} onClick={toggleBg}>Background Color</button>
                        <div className="select-none cursor-default hmd:hidden">&nbsp;</div>
                        <button id="erase" className={TW_button + TW_button_plain + TW_button_plainA} onClick={toggleEraser}>Eraser</button>
                        <button id="undo" className={TW_button + TW_button_plain + TW_button_plainA} onClick={undo}>Undo</button>
                        <button id="redo" className={TW_button + TW_button_plain + TW_button_plainA} onClick={redo}>Redo</button>
                        <button id="clear" className={TW_button + TW_button_plain + TW_button_plainA} onClick={clearCanvas} type="button">Clear</button>
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
        if (props.checkReset() === true) {
            props.model.users[props.model.user.uid].canvasCurrent = document.getElementById("drawing-area").toDataURL("image/png")
        }
        props.checkReset(false)
    }
    function closeMenus(event) {
        const draft = document.getElementById("draft").classList; 
        const save = document.getElementById("save").classList; 
        if (!draft.contains("hidden") && (event?.target.id !== "show-draft"))
            draft.toggle("hidden");
        if (!save.contains("hidden") && (event?.target.id !== "show-save"))
            save.toggle("hidden");
    }
    function paletteButtonClick() {
        let style = document.getElementById("sketch-picker").style
        if (style.visibility === "hidden") {
            style.visibility = "visible";
        }else {
            style.visibility = "hidden";
        }
    }
    function handleSubmit(event) {
        const img = event.target.files[0]
        if (!img) return;
        const reader = new FileReader();
        //assign onLoad event
        reader.onload = ((e) => {
            overwriteCanvas(e.target.result)            
        });
        //give reader img, triggers onLoad event
        reader.readAsDataURL(img)
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

    function toggleMenu(event) {
        const element = document.getElementById(event.target.value);
        if (event.target.value === "save") {
            element.firstChild.firstChild.childNodes.forEach((node) => {
                if(node.nodeName === "IMG")
                    node.src = (props.model.users[props.model.user.uid].canvasCurrent || "https://placehold.co/64x32?text=No+Image+Found");
            });
        }
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
            // if (img.width !== element.width || img.height !== element.height) {
            //     console.error("Preventing Canvas overwrite due to img with incorrect dimensions (" + img.width + "x" + img.height + ")\n"
            //     + "\tImg should be equal to Canvas (" + element.width + "x" + element.height + ")");
            //     return;
            // }
            props.clearCanvas();
            extra.drawImage(img, 0, 0, 64, 32);
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

        if (event.button === 2 && !props.eraser) {
            //* right click erase
            props.eraserToggle(true)
            props.drawRect(cords[0], cords[1], element)
            props.eraserToggle(false)
        } else { 
            //* regualr draw
            props.drawRect(cords[0], cords[1], element)
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