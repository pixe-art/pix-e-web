// Alvin
import "../globals.css"
import "./tempStyles.css"
import { getCords } from "@/utilities";
import React,{useState} from "react";
import ColorPalette from "./colorPalette";
import { SketchPicker } from 'react-color';

function ArtTool() {
    const [color, setColor] = useState("#000000"); // default color (black)

    const handleChangeComplete = (color) => {
        setColor(color.hex);
    };

    //global variables
    let mouseCheck = false;
    let lastXY;

    function clearCanvasEvent() {
        try {
            document.getElementById("drawing-area").getContext("2d").reset();        
        } catch (error) {
            console.error(error);
        }
    }
    function checkResetEvent() {
        //* flags check as false, used for mouseDragEvent
        mouseCheck = false;
    }
    function debugEvent() {
        //! log outputs for checking canvas size
        const element = document.getElementById("drawing-area");
        let foo = element.getBoundingClientRect();
        let style = getComputedStyle(element);
        let multH = foo.height/element.height;
        let multW = foo.width/element.width;
        console.log("\n[ DEBUG INFO ]\n");
        console.log("canvas scaling = " + style.scale);
        console.log("size difference (mult):\nwidth = " + multW + "x\nheight = " + multH + "x");
        console.log("canvas size:\nwidth = " + foo.width + "\nheight = " + foo.height);
        console.log("canvas edges:\nlft = " + foo.left + "\nrgt = " + foo.right + "\ntop = " + foo.top + "\nbot = " + foo.bottom);
        console.log("border = " + style.border + "\n(needs offset of " + style.border.split(" ")[0] + ")");
        console.log("padding = " + style.padding + "\n(needs offset of " + style.padding.split(" ")[0] + ")");
    }

    function drawEvent(event) {
        event.preventDefault();
        mouseCheck = true //for mouseDragEvent()
        let element = document.getElementById(event.target.id);
        //* translate event coordiantes to the canvas 
        const cords = getCords(element, event.clientX, event.clientY);

        //* draw pixel
        let extra = element.getContext("2d");
        if (event.button === 0) {
            extra.fillRect(cords[0], cords[1], 1, 1); //draw pixel at translated coordinates
            lastXY = cords; //used for fallback in mouseDragEvent()
        }
    }
    //TODO: fixed fast mouse movement. next fix issue when moving mouse too fast outside canvas while holding mouse button
    function mouseDragEvent(event) {
        if (!mouseCheck) return;

        const element = document.getElementById(event.target.id);
        const ctx = element.getContext("2d");
        const newCords = getCords(element, event.clientX, event.clientY);

        // draw a line from lastXY to newCords using direct pixel manipulation
        const dx = Math.abs(newCords[0] - lastXY[0]);
        const dy = -Math.abs(newCords[1] - lastXY[1]);
        let sx = (lastXY[0] < newCords[0]) ? 1 : -1; //determine if movement is right or left
        let sy = (lastXY[1] < newCords[1]) ? 1 : -1; //determine if movement is up or down
        let err = dx + dy, e2;

        while (true) {
            ctx.fillRect(lastXY[0], lastXY[1], 1, 1); // set pixel
            // check if the current coordinates have reached the new coordinates
            if (lastXY[0] === newCords[0] && lastXY[1] === newCords[1]) {
                break;
            }
            // check if it's necessary to step in the x direction
            e2 = 2 * err;
            if (e2 >= dy) { 
                err += dy; lastXY[0] += sx; 
            }
            // check if it's necessary to step in the y direction
            if (e2 <= dx) { 
                err += dx; lastXY[1] += sy; 
            }
        }

        lastXY = newCords; // update last position of mouse
    }

    function touchDrawEvent(event){
        let element = document.getElementById(event.target.id);
        const cords = getCords(element, event.targetTouches[0]?.clientX || event.clientX, event.targetTouches[0]?.clientY || event.clientY)
        element.getContext("2d").fillRect(cords[0], cords[1], 1, 1)
    }
    function touchDragEvent(event) {
        console.log(event);
        touchDrawEvent(event)
    }

    return(
        <div className="parent" onMouseUp={checkResetEvent}>
            <div className="topbar">
                <h1>(bar doesnt work right on narrow screens)</h1>
                <button onClick={debugEvent} type="button">click for debug info</button>
                <button onClick={clearCanvasEvent} type="button">click to clear canvas</button>
            </div>
            <div className="content">
                <p>Drawing Canvas</p>
                <div>
                <SketchPicker color={color} onChangeComplete={handleChangeComplete} />
                <canvas style={{ border: '1px solid #ccc' }} /* Your canvas attributes and event handlers */ />
                </div>
                <canvas className="canvas" id="drawing-area" width="64" height="32" onContextMenu={drawEvent}
                onMouseDown={drawEvent} onMouseMove={mouseDragEvent} onTouchStart={touchDrawEvent} onTouchMove={touchDragEvent}>
                </canvas>
            </div>

        </div>
    );
    }
    export default ArtTool;