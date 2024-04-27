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
                        <input type="color" name="" id="color-d" value={"black"} disabled="true" className="color-display"/>
                        <button id="erase" onClick={toggleEraser}>Eraser</button>
                        <button id="undo" onClick={undo}>Undo</button>
                        <button id="redo" onClick={redo}>Redo</button>
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
        if (props.setEraser()) {
            con.clearRect(x, y, props.changePenSize(), props.changePenSize())            
        } else {
            con.fillRect(x, y, props.changePenSize(), props.changePenSize())            
        }
    }
    function colorChangeEvent(event) {
        // changes color of draw style on canvas
        const canvas = document.getElementById("drawing-area")
        const colorDisplay = document.getElementById("color-d")
        const con = canvas.getContext("2d")
        const color = props.handleColorChange(event);
        con.fillStyle = color 
        colorDisplay.value = color;
    }
    function debugEvent() {
        //! log outputs for checking canvas size
        const element = document.getElementById("drawing-area");
        props.printDebugInfo(element)
    }
    function clearCanvas() {
        // clears canvas and its history
        try {
            const element = document.getElementById("drawing-area");
            const con = element.getContext("2d");
            // props.unshiftUndoHistory(element)
            // empty canvas
            const temp = con.fillStyle;
            con.reset();
            con.fillStyle = temp;
        } catch (error) {
            console.error(error);
        }
    }
    function downloadCanvas() {
        // creates an off screen png image that downloads to users machine
        const element = document.getElementById("drawing-area");
        const temp = document.createElement('a');
        //? replacing png to octet stream is necessary for download to work
        const img = element.toDataURL("image/png").replace("image/png", "image/octet-stream");
        temp.setAttribute("href", img);
        temp.setAttribute("download", "canvas.png");
        temp.click();   
        temp.remove();
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
            clearCanvas()
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
        const eraserState = props.setEraser("toggle");
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
        props.setLastXY([-1, -1]);
    }
    function mouseClickEvent(event) {
        event.preventDefault();
        saveCurrent();
        props.checkReset(true)
        const element = document.getElementById(event.target.id);
        //* translate event coordiantes to the canvas 
        const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);

        //* draw pixel
        const con = element.getContext("2d");
        drawRect(cords[0], cords[1], con)
        props.setLastXY(cords); //used for fallback in mouseDragEvent()
        }
    function mouseDragEvent(event) {
        if ((event.buttons === 2 || event.buttons === 1) && props.checkReset() === true) {
            const element = document.getElementById(event.target.id);
            const extra = element.getContext("2d");
            const cords = getCords(element, event.clientX, event.clientY, (props.changePenSize()-1)/2);

            if (props.setLastXY()[0] < 0 || props.setLastXY()[1] < 0) {
                props.setLastXY(cords);
            }
            if (event.buttons === 2) {
                const temp = props.setEraser()
                props.setEraser(false, true)
                draw_line(cords[0],cords[1],extra)
                props.setEraser(false, temp)
            } else {
                draw_line(cords[0],cords[1],extra)
            }
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
            drawRect(x, y, con)
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
                drawRect(x, y, con)
            }
        } else { //* The line is Y-axis dominant
            // Line is drawn bottom to top
            if (dy >= 0) {
                x = x1; y = y1; ye = y2;
            } else { // Line is drawn top to bottom
                x = x2; y = y2; ye = y1;
            }
            drawRect(x, y, con)

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
                drawRect(x, y, con)
            }
        }
    } 
}
export default ArtTool;