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