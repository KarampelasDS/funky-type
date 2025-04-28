import { configureStore } from "@reduxjs/toolkit";
import modeReducer from "./mode";

const store = configureStore({
  reducer: {
    mode: modeReducer, // Add the mode reducer
  },
});

export default store;
