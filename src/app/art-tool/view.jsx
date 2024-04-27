// Alvin
import "../globals.css"
import "./tempStyles.css"
import { getCords } from "@/utilities";
import React,{useState} from "react";
//import ColorPalette from "./colorPalette";
import { SketchPicker } from 'react-color';
import Draggable from './draggable';

//! temporary var:
let fresh = true;

function ArtTool(props) {
    return( 
        <div className="parent" onMouseUp={mouseUp}>
            <div className="topbar">
                <h1>Left-Click to draw | Right-Click to erase | Middle-Click for single pixel</h1>
                <button onClick={debugEvent} type="button">click for debug info</button>
            </div>
            <div className="content">
                <div className="palette">
                <Draggable className="draggable">
                    <button className="palette-button" onClick={paletteButtonClick}>Toggle Color Palette</button>
                        {(
                            <div className="color-palette" id="sketch-picker" style={{ display: 'none' }}>
                                <SketchPicker color={props.color} onChangeComplete={colorChangeEvent} />
                            </div>
                            )}
                </Draggable>
                
                </div>
                <div>
                    <canvas className="canvas" id="drawing-area" width="64" height="32" onContextMenu={(event)=>{event.preventDefault()}}
                    onMouseDown={mouseClickEvent} onMouseMove={mouseDragEvent} onTouchStart={touchDrawEvent} onTouchMove={touchDragEvent} onMouseLeave={resetLastCoords}>
                        {/* <script>{clearCanvas()}</script> */}
                    </canvas>
                </div>
                <div className="tools">
                    <div className="tool-buttons">
                        <input type="color" name="" id="color-d" value={props.color} disabled={true} className="color-display"/>
                        <button id="erase" onClick={toggleEraser}>Eraser</button>
                        <button id="undo" onClick={undo}>Undo</button>
                        <button id="redo" onClick={redo}>Redo</button>
                        <button id="clear" onClick={props.clearCanvas} type="button">Clear</button>
                        <button id="download" onClick={props.downloadCanvas} type="button">Download</button>
                        <div>
                            <p>pen size</p>
                            <p>&nbsp;</p>                            
                            <p id="pen-size-d">1</p>                            
                        </div>
                        <input type="range" name="pen-size" id="pen-size" defaultValue={props.changePenSize()} min={"1"} max={"12"} onChange={penSizeEvent}/>
                    </div>
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
    function drawRect(x, y, con) {
        props.clearRedoHistory();
        // draw rectangles on canvas ('con') at position [x, y]
        if (props.eraserToggle()) {
            con.clearRect(x, y, props.changePenSize(), props.changePenSize())            
        } else {
            con.fillRect(x, y, props.changePenSize(), props.changePenSize())            
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
            if (img.width > element.width || img.height > element.height) {
                console.error("Preventing Canvas overwrite due to img having too large dimensions (" + img.width + "x" + img.height + ")\n"
                + "\tImg should not be larger than Canvas (" + element.width + "x" + element.height + ")");
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
        const eraserState = props.eraserToggle("toggle");
        if (eraserState) {
            element.className = "active"
        } else {
            element.className = "";
        }
    }
    function penSizeEvent(event) {
        document.getElementById("pen-size-d").innerHTML = props.changePenSize(event.target.value);
    }

    function resetLastCoords(){
        props.setLastCords([-1, -1]);
    }
    function mouseClickEvent(event) {
        event.preventDefault();
        // right click erase
        if (event.button === 2) {
            props.eraserToggle(false, true);
        }
        saveCurrent();
        props.checkReset(true)
        const element = document.getElementById(event.target.id);
        //* translate event coordiantes to the canvas 
        const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);

        //* draw pixel
        const con = element.getContext("2d");
        drawRect(cords[0], cords[1], con)
        props.setLastCords(cords); //used for fallback in mouseDragEvent()
        }

    function mouseDragEvent(event) {
        const canvas = document.getElementById("drawing-area");
        const [x2, y2] = getCords(canvas, event.clientX, event.clientY, (props.penSize - 1) / 2);
        if ((event.buttons === 1 || event.buttons === 2) && props.checkReset()) {
            if (props.lastXY[0] === -1 && props.lastXY[1] === -1) {
                props.setLastCords([x2, y2]);  // Update without drawing if last coordinates were invalid
            } else {
                props.drawLine(canvas, x2, y2);
            }
        }
    }
        
    function touchDrawEvent(event){
        const element = document.getElementById(event.target.id);
        const cords = getCords(element, event.targetTouches[0]?.clientX || event.clientX, event.targetTouches[0]?.clientY || event.clientY)
        element.getContext("2d").fillRect(cords[0], cords[1], props.changePenSize(), props.changePenSize())
        props.setLastCords(cords);
    }
    function touchDragEvent(event) {
        const element = document.getElementById(event.target.id);
        const extra = element.getContext("2d");
        try {
            const cords = getCords(element, 
                event.targetTouches[0]?.clientX || event.Touch[0]?.clientX || event.clientX, 
                event.targetTouches[0]?.clientY || event.Touch[0]?.clientY || event.clientY);            
                // draw_line(props.lastXY[0], props.lastXY[1], , extra);
                draw_line(cords[0],cords[1],extra)
                props.setLastCords(cords);
        } catch (error) {
            
        }
    }
}
export default ArtTool;