import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface initialStateTypes {
  isSheetEditiorOpen: boolean;
}

const initialState: initialStateTypes = {
  isSheetEditiorOpen: false,
};

export const globalState = createSlice({
  name: "app-state",
  initialState,
  reducers: {
    setIsSheetEditiorOpen: (state) => {
      state.isSheetEditiorOpen = !state.isSheetEditiorOpen;
    },
  },
});

export const { setIsSheetEditiorOpen } = globalState.actions;
