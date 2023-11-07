import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface isLoadingSlice {
  value: boolean;
}

const initialState: isLoadingSlice = {
  value: true,
};

export const isLoading = createSlice({
  name: "isLoading",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setIsLoading: (state, action: PayloadAction<boolean>) => {
      state.value = action.payload;
    },
  },
});

const isLoadingReducer = isLoading.reducer; // This is the reducer for the isLoading

export const { setIsLoading } = isLoading.actions;

export default isLoadingReducer;
