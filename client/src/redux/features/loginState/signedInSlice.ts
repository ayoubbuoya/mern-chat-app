import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface signedInSlice {
  value: boolean;
}

const initialState: signedInSlice = {
  value: false,
};

export const isSignedIn = createSlice({
  name: "isSignedIn",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setIsSignedIn: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

const isSignedInReducer = isSignedIn.reducer; // This is the reducer for the isSignedIn

export const { setIsSignedIn } = isSignedIn.actions;

export default isSignedInReducer;
