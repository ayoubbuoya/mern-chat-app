import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface User {
  id: number | null;
  name: string;
  username: string;
  email: string;
  picture: string;
  // status: string;
  // lastSeen: string;
  createdAt: string;
  // updatedAt: string;
}

interface currentUserState {
  value: User;
}

const initialState: currentUserState = {
  value: {
    id: null,
    name: "",
    username: "",
    email: "",
    picture: "",
    // status: "active",
    // lastSeen: "3 minutes ago",
    createdAt: "",
    // updatedAt: "2021-01-01T12:00:00.000Z",
  },
};

export const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    setCurrentUser: (state, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
  },
});

const currentUserReducer = currentUserSlice.reducer; // This is the reducer for the currentUserSlice

export const { setCurrentUser } = currentUserSlice.actions;

export default currentUserReducer;
