// Alvin
//* 'use client': specifies that code runs on clients browser. (enables use of observer) *//
'use client'; 
import ArtTool from "./view";
import { observer } from "mobx-react-lite"; //? observer

export default observer(
    function Tool() {
            
        return(
            <ArtTool/>
        );
    }
)