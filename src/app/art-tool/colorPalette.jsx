import React, {useState} from 'react';
import { SketchPicker } from 'react-color';


const ColorPalette = ({color = "black", onChangeComplete}) => (
    <SketchPicker color = {color} onChangeComplete = {onChangeComplete} />
);

export default ColorPalette;