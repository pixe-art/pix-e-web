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
    const paletteButtonClick = () => {
        props.setShowPicker(!props.showPicker);
    }
    return( 
        <div className="parent" onMouseUp={props.checkReset}>
            <div className="topbar">
                <h1>Left-Click to draw | Right-Click to erase | Middle-Click for single pixel</h1>
                <button onClick={debugEvent} type="button">click for debug info</button>
            </div>
            <div className="content">
                <div className="palette">
                <Draggable className="draggable">
                    <button className="palette-button" onClick={paletteButtonClick}>Toggle Color Palette</button>
                        {props.showPicker && (
                            <div className="color-palette">
                                <SketchPicker color={props.color} onChangeComplete={props.handleColorChange} />
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
                        <button id="erase" disabled={true} onClick={eraserEvent}>Eraser</button>
                        <button id="undo" onClick={undo}>Undo</button>
                        <button id="redo" disabled={true}>Redo</button>
                        <button id="clear" onClick={clearCanvas} type="button">Clear</button>
                        <button id="download" onClick={downloadCanvas} type="button">Download</button>
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

    function debugEvent() {
        //! log outputs for checking canvas size
        const element = document.getElementById("drawing-area");
        props.printDebugInfo(element)
    }
    function clearCanvas() {
        console.log("clearing canvas");
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
            props.clearUndoHistory();
        } catch (error) {
            console.error(error);
        }
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
        const canvas = document.getElementById("drawing-area");
        props.unshiftUndoHistory(canvas)     
    }
    function undo() {
        const element = document.getElementById("drawing-area");
        let img = new Image()
        const last = props.grabLastImage()
        if (!last) {
            return;
        }
        img.src = last;
        img.onload = () => {
            element.getContext("2d").drawImage(img,0,0);
            img.remove();
        }
    }
    function eraserEvent(event) {
        const element = document.getElementById(event.target.id);
        if (element.className.includes("active")) {
            element.className = ""
            props.currentColor(true);
        } else {
            element.className = "active"
            props.drawColor = "white"
        }
    }
    function penSizeEvent(event) {
        document.getElementById("pen-size-d").innerHTML = props.changePenSize(event.target.value);
    }

    function resetLastCoords(){
        props.setLastXY([-1, -1]);
    }
    function mouseClickEvent(event) {
        if (fresh) {
            fresh = false;
            clearCanvas();
        }
        if (props.penColor !== props.drawColor && props.penColor !== "white") {
            props.currentColor(true)
        }
        event.preventDefault();
        saveCurrent();
        const element = document.getElementById(event.target.id);
        //* translate event coordiantes to the canvas 
        const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);

        //* draw pixel
        const extra = element.getContext("2d");
        extra.save();
        if (event.button === 2) {
            extra.fillStyle = "white";
        } else {
            extra.fillStyle = props.drawColor;
        }
        extra.fillRect(cords[0], cords[1], props.changePenSize(), props.changePenSize()); //draw pixel at translated coordinates
        props.setLastXY(cords); //used for fallback in mouseDragEvent()
        extra.restore();
        }
    function mouseDragEvent(event) {
        if ((event.buttons === 2 || event.buttons === 1)) {
            const element = document.getElementById(event.target.id);
            const extra = element.getContext("2d");
            const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);

            extra.save();
            // set draw color to white for erase if right click
            extra.fillStyle = "white";
            if (event.buttons === 2) {
                extra.fillStyle = "white";
            } else {
                extra.fillStyle = props.currentColor(true);
            }
            if (props.setLastXY()[0] < 0 || props.setLastXY()[1] < 0) {
                props.setLastXY(cords);
            }
            draw_line(cords[0],cords[1],extra)
            extra.restore();
            props.setLastXY(cords);
        }
    }
    function touchDrawEvent(event){
        const element = document.getElementById(event.target.id);
        const cords = getCords(element, event.targetTouches[0]?.clientX || event.clientX, event.targetTouches[0]?.clientY || event.clientY)
        element.getContext("2d").fillRect(cords[0], cords[1], props.changePenSize(), props.changePenSize())
        props.setLastXY(cords);
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
                props.setLastXY(cords);
        } catch (error) {
            
        }
    }
    function draw_line(x2, y2, con) {
        const x1 = props.setLastXY()[0]
        const y1 = props.setLastXY()[1]
        // draw_line taken and adapted from https://ghost-together.medium.com/how-to-code-your-first-algorithm-draw-a-line-ca121f9a1395
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
            con.fillRect(x, y, props.changePenSize(), props.changePenSize());

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
                con.fillRect(x, y, props.changePenSize(), props.changePenSize());
            }
        } else { //* The line is Y-axis dominant
            // Line is drawn bottom to top
            if (dy >= 0) {
                x = x1; y = y1; ye = y2;
            } else { // Line is drawn top to bottom
                x = x2; y = y2; ye = y1;
            }
            con.fillRect(x, y, props.changePenSize(), props.changePenSize());

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
                con.fillRect(x, y, props.changePenSize(), props.changePenSize());
            }
        }
    } 
}
export default ArtTool;