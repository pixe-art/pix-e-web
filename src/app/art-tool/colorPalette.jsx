import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPalette = ({color, onChangeComplete}) => (
    <SketchPicker color = {color} onChangeComplete = {onChangeComplete} />
);

export default ColorPalette;