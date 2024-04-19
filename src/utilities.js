export function getCords(element, x, y, offset) {
    //* assign values to variables
    let style = getComputedStyle(element);
    let scale = style.scale;
    let canvas = element.getBoundingClientRect();
    let offsetBorder = parseInt(style.border.split("px")[0]);
    let offsetPadding = parseInt(style.padding.split("px")[0]);
    let fullOffset = Math.floor(offset + offsetBorder + offsetPadding);

    //* calculate relative positions
    const posX = (Math.floor(((x - canvas.left)/scale)) - fullOffset);
    const posY = (Math.floor(((y - canvas.top)/scale)) - fullOffset);

    return [posX, posY];
}