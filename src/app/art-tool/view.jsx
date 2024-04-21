// Alvin
import "../globals.css"
import "./tempStyles.css"
import { getCords } from "@/utilities";
import React,{useState} from "react";
//import ColorPalette from "./colorPalette";
import { SketchPicker } from 'react-color';
import Draggable from './draggable';

function ArtTool() {
const [color, setColor] = useState("#000000"); // default color (black)
const [showPicker, setShowPicker] = useState(false)

const handleColorChange = (color) => {
    setColor(color.hex);
    penColor = color.hex;
}
const paletteButtonClick = () => {
    setShowPicker(!showPicker);
}
    return( 
        <div className="parent" onMouseUp={checkReset}>
            <div className="topbar">
                <h1>Left-Click to draw | Right-Click to erase | Middle-Click for single pixel</h1>
                <button onClick={debugEvent} type="button">click for debug info</button>
            </div>
            <div className="content">
                <div className="palette">
                <Draggable className="draggable">
                    <button className="palette-button" onClick={paletteButtonClick}>Toggle Color Palette</button>
                        {showPicker && (
                            <div className="color-palette">
                                <SketchPicker color={color} onChangeComplete={handleColorChange} />
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
                        <button id="erase" onClick={eraserEvent}>Eraser</button>
                        <button id="undo" onClick={undo}>Undo</button>
                        <button id="redo" disabled="true">Redo</button>
                        <button id="clear" onClick={clearCanvas} type="button">Clear</button>
                        <button id="download" onClick={downloadCanvas} type="button">Download</button>
                        <div>
                            <p>pen size</p>
                            <p>&nbsp;</p>                            
                            <p id="pen-size-d">1</p>                            
                        </div>
                        <input type="range" name="pen-size" id="pen-size" defaultValue={"1"} min={"1"} max={"12"} onChange={penSizeEvent}/>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default ArtTool;


//global variables
let mouseCheck = false;
let lastXY;
let penSize = 1;
let penColor = "black";
let currentColor = "black";
const historyLength = 10
let undoHistory = new Array(historyLength);

let fresh = true;

function debugEvent() {
    //! log outputs for checking canvas size
    const element = document.getElementById("drawing-area");
    const foo = element.getBoundingClientRect();
    const style = getComputedStyle(element);
    const multH = foo.height/element.height;
    const multW = foo.width/element.width;
    console.log("\n[ DEBUG INFO ]\n");
    console.log("canvas scaling = " + style.scale);
    console.log("size difference (mult):\nwidth = " + multW + "x\nheight = " + multH + "x");
    console.log("canvas size:\nwidth = " + foo.width + "\nheight = " + foo.height);
    console.log("canvas edges:\nlft = " + foo.left + "\nrgt = " + foo.right + "\ntop = " + foo.top + "\nbot = " + foo.bottom);
    console.log("border = " + style.border + "\n(needs offset of " + style.border.split(" ")[0] + ")");
    console.log("padding = " + style.padding + "\n(needs offset of " + style.padding.split(" ")[0] + ")");
}

function clearCanvas() {
    try {
        // declare elements
        const element = document.getElementById("drawing-area");
        const extra = element.getContext("2d");
        // fill canvas with white
        extra.save();
        extra.fillStyle = "white";
        extra.fillRect(0,0, element.width, element.height);        
        extra.restore();
        // reset undo history
        undoHistory = new Array(historyLength);
    } catch (error) {
        console.error(error);
    }
}
function checkReset() {
    //* flags check as false, used for mouseDragEvent
    mouseCheck = false;
}
function downloadCanvas() {
    const element = document.getElementById("drawing-area");
    const temp = document.createElement('a');
    const img = element.toDataURL("image/png").replace("image/png", "image/octet-stream");
    temp.setAttribute("href", img);
    temp.setAttribute("download", "canvas.png");
    temp.click();   
    temp.remove();
}
function saveCurrent() {
    const element = document.getElementById("drawing-area");
    if (undoHistory.at(historyLength)) {
        undoHistory.pop()
    }        
    undoHistory.unshift(element.toDataURL())
}
function undo() {
    const element = document.getElementById("drawing-area");
    let img = new Image()
    let last = undoHistory[0];
    undoHistory = undoHistory.slice(1)
    if (!last) {
        return;
    }
    img.src = last;
    img.onload = () => {
        element.getContext("2d").drawImage(img,0,0);
    }
}
function eraserEvent(event) {
    const element = document.getElementById(event.target.id);
    if (element.className.includes("active")) {
        element.className = ""
        currentColor = penColor;
    } else {
        element.className = "active"
        currentColor = "white"
    }
}
function penSizeEvent(event) {
    penSize = event.target.value;
    document.getElementById("pen-size-d").innerHTML = event.target.value;
}

function resetLastCoords(){
    lastXY = [-1, -1];
}
function mouseClickEvent(event) {
    if (fresh) {
        fresh = false;
        clearCanvas();
    }
    if (penColor !== currentColor && penColor !== "white") {
        currentColor = penColor
    }
    event.preventDefault();
    saveCurrent();
    mouseCheck = true //for mouseDragEvent()
    const element = document.getElementById(event.target.id);
    //* translate event coordiantes to the canvas 
    const cords = getCords(element, event.clientX, event.clientY, (penSize-1)/2);

    //* draw pixel
    const extra = element.getContext("2d");
    extra.save();
    if (event.button === 2) {
        extra.fillStyle = "white";
    } else {
        extra.fillStyle = currentColor;
    }
    extra.fillRect(cords[0], cords[1], penSize, penSize); //draw pixel at translated coordinates
    lastXY = cords; //used for fallback in mouseDragEvent()
    extra.restore();
    }
function mouseDragEvent(event) {
    if ((event.buttons === 2 || event.buttons === 1) && mouseCheck) {
        const element = document.getElementById(event.target.id);
        const extra = element.getContext("2d");
        const cords = getCords(element, event.clientX, event.clientY, (penSize-1)/2);

        extra.save();
        // set draw color to white for erase if right click
        extra.fillStyle = "white";
        if (event.buttons === 2) {
            extra.fillStyle = "white";
        } else {
            extra.fillStyle = currentColor;
        }
        if (lastXY[0] < 0 || lastXY[1] < 0) {
            lastXY = cords;
        }
        draw_line(lastXY[0], lastXY[1], cords[0], cords[1], extra);
        extra.restore();

        lastXY = cords;
    }
}
function touchDrawEvent(event){
    const element = document.getElementById(event.target.id);
    const cords = getCords(element, event.targetTouches[0]?.clientX || event.clientX, event.targetTouches[0]?.clientY || event.clientY)
    element.getContext("2d").fillRect(cords[0], cords[1], penSize, penSize)
    lastXY = cords;
}
function touchDragEvent(event) {
    const element = document.getElementById(event.target.id);
    const extra = element.getContext("2d");
    try {
        const cords = getCords(element, 
            event.targetTouches[0]?.clientX || event.Touch[0]?.clientX || event.clientX, 
            event.targetTouches[0]?.clientY || event.Touch[0]?.clientY || event.clientY);            
            draw_line(lastXY[0], lastXY[1], cords[0], cords[1], extra);
            lastXY = cords;
    } catch (error) {
        return;
    }
}
// draw_line taken and adapted from https://ghost-together.medium.com/how-to-code-your-first-algorithm-draw-a-line-ca121f9a1395
function draw_line(x1, y1, x2, y2, con) {
    // Iterators, counters required by algorithm
    let x, y, dx, dy, dx1, dy1, px, py, xe, ye, i;
    // Calculate line deltas
    dx = x2 - x1;
    dy = y2 - y1;
    // Create a positive copy of deltas (makes iterating easier)
    dx1 = Math.abs(dx);
    dy1 = Math.abs(dy);
    // Calculate error intervals for both axis
    px = 2 * dy1 - dx1;
    py = 2 * dx1 - dy1;
    
    if (dy1 <= dx1) { //* The line is X-axis dominant
        // Line is drawn left to right
        if (dx >= 0) {
            x = x1; y = y1; xe = x2;
        } else { // Line is drawn right to left (swap ends)
            x = x2; y = y2; xe = x1;
        }
        con.fillRect(x, y, penSize, penSize); // draws pixel at translated coordinates
        // Rasterize the line
        for (i = 0; x < xe; i++) {
            x = x + 1;
            // Deal with octants...
            if (px < 0) {
                px = px + 2 * dy1;
            } else {
                if ((dx < 0 && dy < 0) || (dx > 0 && dy > 0)) {
                    y++;
                } else {
                    y--;
                }
                px = px + 2 * (dy1 - dx1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            con.fillRect(x, y, penSize, penSize);
        }
    } else { //* The line is Y-axis dominant
        // Line is drawn bottom to top
        if (dy >= 0) {
            x = x1; y = y1; ye = y2;
        } else { // Line is drawn top to bottom
            x = x2; y = y2; ye = y1;
        }
        con.fillRect(x, y, penSize, penSize); // draws pixel at translated coordinates
        // Rasterize the line
        for (i = 0; y < ye; i++) {
            y++;
            // Deal with octants...
            if (py <= 0) {
                py = px + 2 * dx1;
            } else {
                if ((dx < 0 && dy<0) || (dx > 0 && dy > 0)) {
                    x++;
                } else {
                    x--;
                }
                py = py + 2 * (dx1 - dy1);
            }
            // Draw pixel from line span at
            // currently rasterized position
            con.fillRect(x, y, penSize, penSize); // draws pixel at translated coordinates
        }
    }
 }