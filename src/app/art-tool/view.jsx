// Alvin
import "../globals.css"
import "./tempStyles.css"

function ArtTool() {
    return(
        <div className="parent">
            <div>
                <h1 id="topbar" className="topbar">(bar doesnt work right on narrow screens)</h1>
            </div>
            <div className="content" >
                <p>Drawing Canvas</p>
                <canvas className="canvas" id="drawing-area" width="64" height="32" onContextMenu={drawEvent}
                onMouseDown={drawEvent} onMouseUp={checkResetEvent} onMouseMove={dragDrawEvent}>
                </canvas>
            </div>
        </div>
    );
}
export default ArtTool;

let mouseCheck = false;

function checkResetEvent(event) {
    //* flags check as false, used for mouseDragEvent
    mouseCheck = false;
}

function drawEvent(event) {
    event.preventDefault();
    //* check if the event is called with left mouse button
    // if (event.button !== 0) {
    //     return;
    // }
    mouseCheck = true;
    //* assign values to variables
    let element = document.getElementById(event.target.id);
    let style = getComputedStyle(element);
    let scale = style.scale;
    let offsetTop = style.top;
    let offsetLeft = style.left;
    offsetTop = offsetTop.replace("px", "");
    offsetLeft = offsetLeft.replace("px", "");

    //! math with event.target.width or ...height is wierd, but works for scale 12
    //TODO: fix formula so its possible to change canvas scale (in css). 
    const posX = ((((event.clientX-offsetLeft)/scale)+(event.target.width/2.2)).toFixed());
    const posY = ((((event.clientY-offsetTop)/scale)+(event.target.height/2.2)).toFixed());
   
    let extra = element.getContext("2d");
    //* draw pixel
    if (event.button === 0) {
        // console.log("relative coords\n"+ posX + ", " + posY);
        extra.fillRect(posX, posY, 1, 1);
}
}

function dragDrawEvent(event) {
    if (event.buttons === 1 && mouseCheck) {
        drawEvent(event)            
    }
}