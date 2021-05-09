import create from "zustand";
import {combine} from "zustand/middleware";

export const useStore = create(
  combine(
    {
      pane: "replay"
    }, 
    () => ({
      
    })
  )
);
