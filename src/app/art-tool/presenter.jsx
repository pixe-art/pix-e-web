// Alvin
//* 'use client': specifies that code runs on clients browser. (enables use of observer) *//
'use client'; 
import ArtTool from "./view";
import { observer } from "mobx-react-lite"; //? observer
import React, { useState } from "react";

export default observer(
    function Tool() {
        let mouseCheck = false;
        let lastXY = new Array(2);
        let penSize = 1;
        let penColor = "black";
        let drawColor = "black";
        const historyLength = 10
        let undoHistory = new Array(historyLength);
    
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
    
        let [color, setColor] = useState("#000000"); // default color (black)
        let [showPicker, setShowPicker] = useState(false)

        function checkReset() {
            //* flags check as false, used for mouseDragEvent
            mouseCheck = false;
        }
        function clearUndoHistory(){
            console.log("clearing history");
            undoHistory = new Array(historyLength)
        }
        function unshiftUndoHistory(canvas) {
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
        function currentColor(reset) {
            if (reset) {
                drawColor = color
            }
            return drawColor
        }
        function changePenSize(size){
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
        

        function handleColorChange(color){
            setColor(color.hex);
            drawColor = color.hex;
        }

        return(
            <ArtTool
                showPicker = {showPicker}
                mouseCheck = {mouseCheck}
                lastXY = {lastXY}
                penSize = {penSize}
                penColor = {penColor}
                drawColor = {drawColor}
                undoHistory = {undoHistory}
                color = {color}
                setShowPicker = {setShowPicker}
                checkReset = {checkReset}
                grabLastImage = {grabLastImage}
                unshiftUndoHistory = {unshiftUndoHistory}
                changePenSize = {changePenSize}
                setLastXY = {setLastXY}
                clearUndoHistory = {clearUndoHistory}
                printDebugInfo = {printDebugInfo}
                handleColorChange = {handleColorChange}
                currentColor = {currentColor}
            />
        );
    }
)