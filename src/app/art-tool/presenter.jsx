// Alvin
//* 'use client': specifies that code runs on clients browser. (enables use of observer) *//
'use client'; 
import ArtTool from "./view";
import { observer } from "mobx-react-lite"; //? observer
import React, { useState } from "react";

export default observer(
    function Tool() {
        let mouseCheck;
        let lastXY = new Array(2);
        let penSize = 1;
        let eraser = false;
        const historyLength = 10
        let undoHistory;
    
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
        function grabLastImage() {
            const last = undoHistory[0];
            undoHistory = undoHistory.slice(1)
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
        function setEraser(toggle) {
            if (toggle) {
                eraser = !eraser                
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
            // setColor(newColor.hex);              
            color = newColor.hex;              
            return color;
        }

        return(
            <ArtTool
                showPicker = {showPicker}
                lastXY = {lastXY}
                penSize = {penSize}
                undoHistory = {undoHistory}
                color = {color}
                setShowPicker = {setShowPicker}
                checkReset = {setMouseCheck}
                grabLastImage = {grabLastImage}
                unshiftUndoHistory = {unshiftUndoHistory}
                changePenSize = {setPenSize}
                setLastXY = {setLastXY}
                clearUndoHistory = {clearUndoHistory}
                printDebugInfo = {printDebugInfo}
                handleColorChange = {handleColorChange}
                setEraser = {setEraser}
            />
        );
    }
)