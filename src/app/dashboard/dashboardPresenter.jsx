'use client'
import { useModel } from "../model-provider.js";
import { observer } from "mobx-react-lite";

import DashboardView from "./dashboardView.jsx";
import { TW_center } from "../art-tool/tailwindClasses.js";

export default observer(
 function Dashboard(){
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

    if (!model.userReady || !model.ready) {
        return <div>
                 <img className={TW_center} src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
               </div>
    }

    //Pass the setters or even the whole model to the view. This is just an example for now.
    return <DashboardView model={model} setText={setTextACB} setPictures={setPicturesACB}/>
})
