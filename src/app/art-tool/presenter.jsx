// Alvin
//* 'use client': specifies that code runs on clients browser. (enables use of observer) *//
'use client'; 
import ArtTool from "./view";
import { observer } from "mobx-react-lite"; //? observer
import React, { useState, useRef, useEffect } from "react";
import { useModel } from "../model-provider.js";
import { auth, getAuth } from "@/firebaseModel";
import { onAuthStateChanged } from "firebase/auth";
import { buildModelPicture, canvasToData } from "@/utilities";
import { app } from "/src/firebaseModel.js";
import { getStorage, ref as sRef , getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { getDatabase, ref as dbRef , set, push, update, remove } from "firebase/database";


export default observer(
    function Tool() {
        const historyLength = 10;

        const model = useModel();
        const [mouseCheck, setMouseCheck] = useState(false);
        const [lastXY, setLastXY] = useState([-1, -1]);
        const [color, setColor] = useState("black");

        const penSize = useRef(1);
        const eraser = useRef(false);
        const undoHistory = useRef(new Array(10).fill(null));
        const redoHistory = useRef(new Array(10).fill(null));
        const showPicker = useRef(false);

        useEffect(() => {
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if(!user)
                    return Loading();
            })

            return () => {unsubscribe()};
        }, []);

        useEffect(() => {
            setColor(model.colorCurrent);   // update color if color changes in model
            updateCanvasColor();    // change draw color for canvas
        }, [color, model.colorCurrent]);


        function addToDrafts(imgObj) {
            let duplicateFound = false;
            const userId = auth.currentUser.uid;
        
            const imagePath = new URL(imgObj.testPicture).pathname.split('/').pop();
            
            // Create a copy of the image in Firebase storage
            const storage = getStorage(app);
            const imageRef = sRef(storage, imagePath);
            const userImageRef = sRef(storage, 'users/' + userId + '/drafts/' + imgObj.title);

            //check for duplicate
            for (const idx in model.users[userId].drafts) {
                console.log("imgObj.testPicture: ", imgObj.testPicture, " model.users[userId].drafts.testPicture: ", model.users[userId].drafts[idx].testPicture, " index: ", idx);
                if (imagePath === model.users[userId].drafts[idx].testPicture) {
                    duplicateFound = true;
                    console.log("You already have a duplicate saved at model.pictures.testPicture[", idx, "]");
                    return; 
                }
            
            if (duplicateFound) {
                return;
            }
        } 
        
            // Fetch the image data
            fetch(imgObj.testPicture)
                .then(response => response.blob())
                .then(blob => {
                    // Upload the image data to the new path
                    const uploadTask = uploadBytesResumable(userImageRef, blob);
        
                    uploadTask.on('state_changed', 
                        (snapshot) => {
                            // Handle the upload progress
                        }, 
                        (error) => {
                            console.error(error);
                        }, 
                        () => {
                            console.log('Copied image to user storage');
        
                            // Generate Firebase HTTPS link for the image
                            getDownloadURL(userImageRef)
                                .then((url) => {
                                    console.log('Firebase HTTPS link:', url);
        
                                    // Store the reference in the Firebase database
                                    const db = getDatabase(app);
                                    const imageRef = dbRef(db, 'pixeModel/users/' + userId + '/drafts/' + imgObj.title);
                                    update(imageRef, {
                                        id: imgObj.title, 
                                        testPicture: url, // use the url here
                                        title: imgObj.title,
                                        creator: imgObj.creator,
                                        storage: "gs://pix-e-b9fab.appspot.com/users/" + userId + '/drafts/' + imgObj.title
                                    });
                                })
                                .catch((error) => {
                                    console.error(error);
                                });
                        }
                    );
                })
                .catch((error) => {
                    console.error(error);
                });
        }



        function printDebugInfo(canvas) {
            const foo = canvas.getBoundingClientRect();
            const style = getComputedStyle(canvas);
            const multH = foo.height/canvas.height;
            const multW = foo.width/canvas.width;
            console.log("\n[ DEBUG INFO ]\n");
            console.log(window);
            console.log("canvas scaling = " + style.scale);
            console.log("size difference (mult):\nwidth = " + multW + "x\nheight = " + multH + "x");
            console.log("canvas size:\nwidth = " + foo.width + "\nheight = " + foo.height);
            console.log("canvas edges:\nlft = " + foo.left + "\nrgt = " + foo.right + "\ntop = " + foo.top + "\nbot = " + foo.bottom);
            console.log("border = " + style.border + "\n(needs offset of " + style.border.split(" ")[0] + ")");
            console.log("padding = " + style.padding + "\n(needs offset of " + style.padding.split(" ")[0] + ")");
            console.log("model = ", model);
            console.log("user = ", auth.currentUser);
        }
    
        function mouseChecker(state) {
            //* flags check as false, used for mouseDragEvent
            if (state === true || state === false) {
                setMouseCheck(state);
            }
            return mouseCheck;
        }

        function clearUndoHistory(){
            undoHistory.current = new Array(historyLength)
        }
        function unshiftUndoHistory(canvas) {
            if (!Array.isArray(undoHistory.current)) {
                clearUndoHistory();
            }
            if (canvas.toDataURL() === undoHistory.current[0]) {
                return
            }
            if (undoHistory.current.at(historyLength)) {
                undoHistory.current.pop()
            }    
            model.canvasCurrent = canvas.toDataURL(); // persistance bby letsgo
            undoHistory.current.unshift(canvas.toDataURL())
        }
        function clearRedoHistory(){
            redoHistory.current = new Array(historyLength)
        }
        function grabLastImage() {
            const last = undoHistory.current[0];
            undoHistory.current = undoHistory.current.slice(1)
            return last;
        }
        function unshiftRedoHistory(canvas) {
            if (!Array.isArray(redoHistory.current)) {
                clearRedoHistory();
            }
            redoHistory.current.unshift(canvas.toDataURL())        
        }
        function restoreLastImage() {
            const last = redoHistory.current[0];
            redoHistory.current = redoHistory.current.slice(1)
            return last;
        }

        function uploadCanvasStateToFirebase(element) {
            const userID = auth.currentUser.uid;
            console.log("auth: ", auth.currentUser.uid);
            const data = canvasToData(element);
            console.log("got data from canvas:", data);
            console.log()
            const out = buildModelPicture(userID, model.images.length, Date.now(), data, "Your mom");
            let duplicateFound = false;

            //checks for duplicates in firebase
             for (const idx in model.images) {
                if (data === model.images[idx].testPicture) {
                    duplicateFound = true;
                    console.log("You already have a duplicate saved at model.pictures.testPicture[", idx, "]");
                    return; 
                }
            
            if (duplicateFound) {
                return;
            }
        } 

            console.log("data: ", data);
            model.images = [...model.images, out];
            console.log("saved");
        }

        function isCanvasEmpty(canvas) {
            const ctx = canvas.getContext('2d');
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const data = imageData.data;

            for (let i = 3; i < data.length; i += 4) {
                if ((data[i-3] !== 0 && data[i-2] !== 0 && data[i-1] !== 0 && (data[i] !== 255 || data[i] !== 0))) {
                    console.log("data[i-3]: ", data[i-3]);
                    console.log("data[i-2]: ", data[i-2]);
                    console.log("data[i-1]: ", data[i-1]);
                    console.log("data[i]: ", data[i]);
                    console.log("Canvas is not empty");
                    return false;
                }
            }
            console.log("Canvas is empty");
            return true;
        }

        function setPenSize(size){
            if (size) {
                penSize.current = size 
            }
            return penSize.current;
        }
        function setLastCords(xy) {
            if (xy) {
                setLastXY(xy);               
            }
            //return lastXY;
        }
        function eraserToggle(state) {
            if (typeof state === 'boolean') {
                eraser.current = state
            }
            return eraser.current
        }

        function setShowPicker(state) {
            if (state) {                
                showPicker.current = state;
            }
            return showPicker.current
        }
        const handleColorChange = (newColor) => {
            setColor(newColor);  // Update the color state, useEffect runs to updateCanvasColor once color is set
            if (model.colorCurrent !== newColor) {
                model.colorCurrent = newColor; // update color in model
            }
            return newColor;
        }
        
        function updateCanvasColor() {
            const canvas = document.getElementById("drawing-area");
            if (canvas) {
                const ctx = canvas.getContext("2d");
                ctx.fillStyle = color;  // Update the canvas context with the new color
            }
        }

        function drawRect(x, y, ctx) {
            clearRedoHistory();
            // draw rectangles on canvas ('con') at position [x, y]
            if (eraser.current) {
                ctx.clearRect(x, y, penSize.current, penSize.current)            
            } else {
                ctx.fillRect(x, y, penSize.current, penSize.current)            
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
                drawRect(x1, y1, ctx)
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
            const data = canvasToData(canvas).replace("image/png", "image/octet-stream")
            const link = document.createElement('a');
            link.download = "canvas.png";
            link.href = data;
            link.click();
        }

        function clearCanvas() {
            // clears canvas and its history
            try {
                const element = document.getElementById("drawing-area");
                const con = element.getContext("2d");
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
                model = {model}
                color = {color}
                lastXY = {lastXY}
                eraser = {eraser.current}
                penSize = {penSize.current}
                undoHistory = {undoHistory.current}
                drawLine={drawLine}
                drawRect = {drawRect}
                setColor = {setColor}
                setShowPicker = {setShowPicker}
                checkReset = {mouseChecker}
                grabLastImage = {grabLastImage}
                restoreLastImage = {restoreLastImage}
                unshiftUndoHistory = {unshiftUndoHistory}
                unshiftRedoHistory = {unshiftRedoHistory}
                changePenSize = {setPenSize}
                setLastCords = {setLastCords}
                clearUndoHistory = {clearUndoHistory}
                clearRedoHistory = {clearRedoHistory}
                printDebugInfo = {printDebugInfo}
                handleColorChange = {handleColorChange}
                eraserToggle = {eraserToggle}
                downloadCanvas = {downloadCanvas}
                clearCanvas = {clearCanvas}
                uploadToFirebase = {uploadCanvasStateToFirebase}
                isCanvasEmpty = {isCanvasEmpty}
                addToDrafts = {addToDrafts}
            />
        )
    }
)