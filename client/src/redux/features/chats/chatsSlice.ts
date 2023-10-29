import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  sender_username: string;
  receiver_username: string;
  message: string;
  createdAt: string;
}

interface Chat {
  contact: {
    id: string;
    name: string;
    username: string;
    picture: string;
  };
  messages: Message[];
}

interface ChatState {
  value: Chat[] | null;
}

const initialState: ChatState = {
  value: null, 
};

export const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    setChats: (state, action: PayloadAction<Chat[]>) => {
      state.value = action.payload;
    },
  },
});

const chatsReducer = chatsSlice.reducer; 

export const { setChats } = chatsSlice.actions;

export default chatsReducer;
