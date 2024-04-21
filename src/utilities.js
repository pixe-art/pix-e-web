export function getCords(element, x, y, offset) {
    //* assign values to variables
    const style = getComputedStyle(element);
    const canvas = element.getBoundingClientRect();
    const offsetBorder = parseInt(style.border.split("px")[0]);
    const offsetPadding = parseInt(style.padding.split("px")[0]);
    const fullOffset = Math.floor(offset + offsetBorder + offsetPadding);

    //* calculate relative positions
    const posX = (Math.floor(((x - canvas.left)/style.scale)) - fullOffset);
    const posY = (Math.floor(((y - canvas.top)/style.scale)) - fullOffset);

    return [posX, posY];
}