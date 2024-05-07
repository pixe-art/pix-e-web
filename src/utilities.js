export function getCords(element, x, y, offset) {
    //* assign values to variables
    const style = getComputedStyle(element);
    const canvas = element.getBoundingClientRect();
    const offsetBorder = parseFloat(style.border.split("px")[0]);
    const offsetPadding = parseFloat(style.padding.split("px")[0]);
    const fullOffset = Math.round(offset + offsetBorder + offsetPadding);
    //* calculate relative positions
    const posX = (Math.round(((x - (canvas.left))/(style.scale))) - fullOffset);
    const posY = (Math.round(((y - (canvas.top))/(style.scale))) - fullOffset);

    return [posX, posY];
}

export function canvasToData(canvas) {
    const dataImage = canvas.toDataURL("image/png");
    return dataImage;
}

export function buildModelPicture(userID, imageID, lastEdited, URL, imageTitle) {
    console.log("userID util: ", userID);
    if(!(imageID && URL && imageTitle && userID)){
        console.error("function requires all arguments to be filled");
        return
    }
    let out = {
        creator: userID,
        id: imageID,
        lastEdited: lastEdited,
        testPicture: URL,
        title: imageTitle,
        
    }
    return out;
}

/* export function buildUserDraft(creator, imageID, URL, imageTitle) {
    if(!(imageID && URL && imageTitle && creator)){
        console.error("function requires all arguments to be filled");
        return
    }
    let out = {
        creator: creator,
        id: imageID,
        testPicture: URL,
        title: imageTitle,
        
    }
    return out;
}
 */