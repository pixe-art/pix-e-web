// Alvin
import "../globals.css"
import "./tempStyles.css"
import { getCords } from "@/utilities";
import { useRef,React } from "react";
import { SketchPicker } from 'react-color';
import Draggable from './draggable';



function ArtTool(props) {

    const touchHandled = useRef(false);

    return( 
        <div id="parent" className="inset-0 bg-cover bg-slate-800 touch-none" onMouseUp={mouseUp}>
            <div id="topbar" className="hidden w-screen bg-slate-950 text-pretty justify-center p-2 md:flex">
                <div id="instrutions" className="flex justify-center max-w-fit border self-center text-center *:mx-1 *:px-1 flex-row border-none">
                    <h1>Left-Click to draw</h1>
                    <h1>Right-Click to erase</h1>
                    <h1>Middle-Click to place a single pixel</h1>
                    <button id="debug" className="mx-2 border rounded max-w-fit self-center" onClick={debugEvent} type="button">Click here for debug info</button>
                </div>
            </div>
            <div id="content" className="h-screen flex flex-col md:flex-row justify-evenly md:justify-between items-center">
                <div id="color-picker">
                    <Draggable>
                        <div className="flex flex-col items-center justify-center">
                            <button className="min-h-12 min-w-56 w-full bg-slate-800 border rounded-lg md:hover:bg-slate-600" onClick={paletteButtonClick}>Toggle Color Palette</button>
                            {(
                                <div id="sketch-picker" style={{ display: '' }} className="self-center">
                                    <SketchPicker color={props.color} onChangeComplete={colorChangeEvent} className="self-center"/>
                                </div>
                            )}
                        </div>
                    </Draggable>
                </div>
                <div>
                    <canvas className="canvas cursor-crosshair select-none touch-none bg-white border border-slate-600" id="drawing-area" width="64" height="32" onContextMenu={(event)=>{event.preventDefault()}}
                    onMouseDown={mouseClickEvent} onMouseMove={mouseDragEvent} onTouchStart={touchDrawEvent} onTouchMove={touchDragEvent} onMouseLeave={resetLastCoords} />
                </div>
                <div id="tools" className="mt-20 grid md:mt-0 md:ml-4 md:flex md:flex-col items-stretch [&_button]:my-2 [&_button]:select-none">
                    <input id="color-d" className="min-w-full bg-slate-800 cursor-no-drop" type="color" name="" value={props.color} disabled={true} />
                    <button id="erase" className="transition-all bg-slate-800 border rounded-lg md:hover:bg-slate-600" onClick={toggleEraser}>Eraser</button>
                    <button id="undo" className="transition-all bg-slate-800 border rounded-lg md:hover:bg-slate-600 active:bg-slate-200 active:text-black" onClick={undo}>Undo</button>
                    <button id="redo" className="transition-all bg-slate-800 border rounded-lg md:hover:bg-slate-600 active:bg-slate-200 active:text-black" onClick={redo}>Redo</button>
                    <button id="clear" className="transition-all bg-slate-800 border rounded-lg md:hover:bg-slate-600 active:bg-slate-200 active:text-black" onClick={props.clearCanvas} type="button">Clear</button>
                    <button id="download" className="transition-all bg-slate-800 border rounded-lg md:hover:bg-slate-600 active:bg-slate-200 active:text-black" onClick={props.downloadCanvas} type="button">Download</button>
                    <div className="flex flex-row">
                        <p>pen size</p>
                        <p>&nbsp;</p>                            
                        <p id="pen-size-d">1</p>                            
                    </div>
                    <input type="range" name="pen-size" id="pen-size" className="cursor-w-resize" defaultValue={props.changePenSize()} min={"1"} max={"12"} onChange={penSizeEvent}/>
                </div>
            </div>

        </div>
    );
    function mouseUp() {
        props.checkReset(false)
    }
    function paletteButtonClick() {
        let style = document.getElementById("sketch-picker").style
        if (String(style.display).includes("none")) {
            style.display = ''
        } else {
            style.display = 'none'
        }
    }

    function colorChangeEvent(event) {
        const colorDisplay = document.getElementById("color-d");
        const newColor = event.hex;
        const colorVar = props.handleColorChange(newColor);
        colorDisplay.value = colorVar;  // Update the UI element showing the color
    }
    function debugEvent() {
        //! log outputs for checking canvas size
        const element = document.getElementById("drawing-area");
        props.printDebugInfo(element)
    }

    function saveCurrent() {
        // saves current canvas history to undo history 
        const element = document.getElementById("drawing-area");
        props.unshiftUndoHistory(element)     
    }
    function overwriteCanvas(source) {
        // overwrites canvas with an img url
        const element = document.getElementById("drawing-area");
        const extra = element.getContext("2d")
        let img = new Image()
        img.src = source;
        img.onload = () => {
            if (img.width !== element.width || img.height !== element.height) {
                console.error("Preventing Canvas overwrite due to img with incorrect dimensions (" + img.width + "x" + img.height + ")\n"
                + "\tImg should be equal to Canvas (" + element.width + "x" + element.height + ")");
                return;
            }
            props.clearCanvas()
            extra.drawImage(img,0,0);
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
        const ebg = element.classList.toggle('bg-gray-200')
        element.classList.toggle('text-black')
        props.eraserToggle(ebg)
    }
    function penSizeEvent(event) {
        document.getElementById("pen-size-d").innerHTML = props.changePenSize(event.target.value);
    }

    function resetLastCoords(){
        props.setLastCords([-1, -1]);
    }
    function mouseClickEvent(event) {
        if (touchHandled.current) {
            touchHandled.current = false;
            return;
        }
        console.log("mouseClickEvent");
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
        touchHandled.current = true;
        const element = document.getElementById(event.target.id);
        const cords = getCords(element, event.targetTouches[0]?.clientX, event.targetTouches[0]?.clientY, (props.penSize - 1) / 2);
        const ctx = element.getContext("2d");
        props.drawRect(cords[0], cords[1], ctx);
        props.setLastCords(cords);
    }

    function touchDragEvent(event) {
        touchHandled.current = true;
        const canvas = document.getElementById("drawing-area");
        const rect = canvas.getBoundingClientRect();
        const touch = event.targetTouches[0];

        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        const x = Math.round((touch.clientX - rect.left) * scaleX);
        const y = Math.round((touch.clientY - rect.top) * scaleY);
        
        props.drawLine(canvas, x, y);
        //props.setLastCords([x, y]);
    }
}
export default ArtTool;