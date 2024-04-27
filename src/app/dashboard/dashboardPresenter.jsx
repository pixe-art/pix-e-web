'use client'
import { useModel } from "../model-provider.js";

import DashboardView from "./dashboardView.jsx";

export default function Dashboard(){
    //Define this constant to get the reactive model.
    const model = useModel();

    //Setter for the testText
    function setTextACB(string) {
        model.testText = string;
    }

    //Setter for the pictures
    function setPicturesACB(string) {
        model.pictures = [string];
    }

    //Pass the setters or even the whole model to the view. This is just an example for now.
    return <DashboardView model={model} setText={setTextACB} setPictures={setPicturesACB}/>
}
