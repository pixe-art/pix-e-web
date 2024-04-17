// Alvin
import "../globals.css"
import "./tempStyles.css"
import { getCords } from "@/utilities";

function ArtTool() {
    return(
        <div className="parent" onMouseUp={checkResetEvent}>
            <div className="topbar">
                <h1>(bar doesnt work right on narrow screens)</h1>
                <button onClick={debugEvent} type="button">click for debug info</button>
                <button onClick={clearCanvasEvent} type="button">click to clear canvas</button>
            </div>
            <div className="content">
                <p>Drawing Canvas</p>
                <canvas className="canvas" id="drawing-area" width="64" height="32" onContextMenu={drawEvent}
                onMouseDown={drawEvent} onMouseMove={mouseDragEvent} onTouchStart={touchDrawEvent} onTouchMove={touchDragEvent}>
                </canvas>
            </div>

        </div>
    );
}
export default ArtTool;

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
//TODO: fallback functionality for fast mouse movements. (i.e. save last pixel pos and draw a line from last to new position)
function mouseDragEvent(event) {
    if (event?.touches) {
        drawEvent(event);
        return;
    }
    if (event.buttons === 1 && mouseCheck) {
        drawEvent(event);
        // let extra = document.getElementById(event.target.id).getContext("2d");
        // const cords = getCords(event);
        // extra.lineCap = "square";
        // extra.lineJoin = "miter"
        // extra.miterLimit = "1";
        // extra.lineWidth = "1";
        // extra.moveTo(lastXY[0], lastXY[1]);
        // extra.lineTo(cords[0], cords[1])
        // extra.stroke();
        // lastXY = cords;
        return;
    }
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