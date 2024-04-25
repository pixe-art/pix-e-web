import React, {useState} from 'react';
import { SketchPicker } from 'react-color';

//? ' color = "" ' stops log to be spammed with errors
const ColorPalette = ({color, onChangeComplete}) => (
    <SketchPicker color = {color = ""} onChangeComplete = {onChangeComplete} />
);

export default ColorPalette;