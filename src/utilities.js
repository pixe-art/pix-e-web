export function getCords(element, x, y) {
    //* assign values to variables
    let style = getComputedStyle(element);
    let scale = style.scale;
    let canvas = element.getBoundingClientRect();
    let offsetBorder = parseInt(style.border.split("px")[0]);
    let offsetPadding = parseInt(style.padding.split("px")[0]);

    //* calculate relative positions
    const posX = (Math.floor(((x - canvas.left)/scale)) - offsetBorder - offsetPadding);
    const posY = (Math.floor(((y - canvas.top)/scale)) - offsetBorder - offsetPadding);

    return [posX, posY];
}