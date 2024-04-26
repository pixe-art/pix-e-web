// Alvin
//* 'use client': specifies that code runs on clients browser. (enables use of observer) *//
'use client'; 
import ArtTool from "./view";
import { observer } from "mobx-react-lite"; //? observer
import React, { useState } from "react";

export default observer(
    function Tool() {
        let mouseCheck;
        let lastXY = [new Array(2)];
        let penSize = 1;
        let eraser = false;
        const historyLength = 10
        let undoHistory;
        let redoHistory;
    
        let color = "black"; // default color (black)
        // let [color, setColor] = useState("#000000"); // default color (black)
        let showPicker = false;
        
        function printDebugInfo(canvas) {
            const foo = canvas.getBoundingClientRect();
            const style = getComputedStyle(canvas);
            const multH = foo.height/canvas.height;
            const multW = foo.width/canvas.width;
            console.log("\n[ DEBUG INFO ]\n");
            console.log("canvas scaling = " + style.scale);
            console.log("size difference (mult):\nwidth = " + multW + "x\nheight = " + multH + "x");
            console.log("canvas size:\nwidth = " + foo.width + "\nheight = " + foo.height);
            console.log("canvas edges:\nlft = " + foo.left + "\nrgt = " + foo.right + "\ntop = " + foo.top + "\nbot = " + foo.bottom);
            console.log("border = " + style.border + "\n(needs offset of " + style.border.split(" ")[0] + ")");
            console.log("padding = " + style.padding + "\n(needs offset of " + style.padding.split(" ")[0] + ")");
        }
    
        function setMouseCheck(state) {
            //* flags check as false, used for mouseDragEvent
            if (state === true || state === false) {
                mouseCheck = state;
            }
            return mouseCheck;
        }

        function clearUndoHistory(){
            undoHistory = new Array(historyLength)
        }
        function unshiftUndoHistory(canvas) {
            if (!Array.isArray(undoHistory)) {
                clearUndoHistory();
            }
            if (undoHistory.at(historyLength)) {
                undoHistory.pop()
            }
            undoHistory.unshift(canvas.toDataURL())
        }
        function clearRedoHistory(){
            redoHistory = new Array(historyLength)
        }
        function grabLastImage() {
            const last = undoHistory[0];
            undoHistory = undoHistory.slice(1)
            return last;
        }
        function unshiftRedoHistory(canvas) {
            if (!Array.isArray(redoHistory)) {
                clearRedoHistory();
            }
            redoHistory.unshift(canvas.toDataURL())        
        }
        function restoreLastImage() {
            const last = redoHistory[0];
            redoHistory = redoHistory.slice(1)
            return last;
        }

        function setPenSize(size){
            if (size) {
                penSize = size 
            }
            return penSize;
        }
        function setLastXY(xy) {
            if (xy) {
                lastXY = xy;                
            }
            return lastXY;
        }
        function setEraser(toggle, state) {
            if (toggle) {
                eraser = !eraser
            } else if (state === false || state === true) {
                eraser = state                
            }
            return eraser
        }
        function setShowPicker(state) {
            if (state) {                
                showPicker = state;
            }
            return showPicker
        }
        function handleColorChange(newColor){
            color = newColor;  // Update the color state
            updateCanvasColor();   // Ensure the canvas color is updated whenever color changes
            return color;
        }
        
        function updateCanvasColor() {
            const canvas = document.getElementById("drawing-area");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = color;  // Update the canvas context with the new color
            }
        }

        function drawLine(canvas, x2, y2) {
            const ctx = canvas.getContext("2d");
            let [x1, y1] = lastXY;
            // when mouse leaves canvas while drawing, reset XY
            if (x1 === -1 && y1 === -1) {  
                setLastXY([x2, y2]);       
                return;                    
            }
            // Logic for Bresenham's line algorithm, adapted from https://ghost-together.medium.com/how-to-code-your-first-algorithm-draw-a-line-ca121f9a1395
            let dx = x2 - x1;
            let dy = y2 - y1;
            let sx = (dx < 0) ? -1 : 1;
            let sy = (dy < 0) ? -1 : 1;
            dx = Math.abs(dx);
            dy = Math.abs(dy);
            let err = (dx > dy ? dx : -dy) / 2;
    
            while (true) {
                if (eraser) {
                    ctx.clearRect(x1, y1, penSize, penSize);
                } else {
                    ctx.fillRect(x1, y1, penSize, penSize);
                }
                if (x1 === x2 && y1 === y2) {
                    break;
                }
                let e2 = err;
                if (e2 > -dx) { 
                    err -= dy; 
                    x1 += sx; 
                }
                if (e2 < dy) { 
                    err += dx; 
                    y1 += sy; 
                }
            }
            setLastXY([x2, y2]);
        }

        function downloadCanvas() {
            const canvas = document.getElementById("drawing-area");
            const dataURL = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
            const link = document.createElement('a');
            link.download = "canvas.png";
            link.href = dataURL;
            link.click();
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
        


        return(
            <ArtTool
                drawLine={drawLine}
                showPicker = {showPicker}
                lastXY = {lastXY}
                penSize = {penSize}
                undoHistory = {undoHistory}
                color = {color}
                setShowPicker = {setShowPicker}
                checkReset = {setMouseCheck}
                grabLastImage = {grabLastImage}
                restoreLastImage = {restoreLastImage}
                unshiftUndoHistory = {unshiftUndoHistory}
                unshiftRedoHistory = {unshiftRedoHistory}
                changePenSize = {setPenSize}
                setLastXY = {setLastXY}
                clearUndoHistory = {clearUndoHistory}
                clearRedoHistory = {clearRedoHistory}
                printDebugInfo = {printDebugInfo}
                handleColorChange = {handleColorChange}
                setEraser = {setEraser}
                downloadCanvas = {downloadCanvas}
                clearCanvas = {clearCanvas}
            />
        );
    }
)