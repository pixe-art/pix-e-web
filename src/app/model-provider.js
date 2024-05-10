"use client"
import { createContext, useContext, useState, useEffect } from "react";
import { observable, configure } from "mobx";
import pixeModel from "@/pixeModel";
import {connectToFirebase, readFromFirebase} from "@/firebaseModel"

configure({ enforceActions: "never", });
const reactiveModel = observable(pixeModel);
const ModelContext = createContext(null);

export function ModelProvider({ children })  {
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      readFromFirebase(reactiveModel).then(loadingACB);
  }, []); 

    function loadingACB() {
      setIsLoading(false);
    }

    if (isLoading)
    return (
        <body>
          <img src="https://brfenergi.se/iprog/loading.gif" alt="Loading gif"></img>
        </body>
    );

    return (
        <ModelContext.Provider value={reactiveModel}>
          {children}
        </ModelContext.Provider>
    );

}

export const useModel = () => useContext(ModelContext);
console.log(reactiveModel);
connectToFirebase(reactiveModel);
