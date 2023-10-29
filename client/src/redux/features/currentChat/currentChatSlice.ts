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
  value: Chat | null;
}

const initialState: ChatState = {
  value: null, 
};

export const currentChatSlice = createSlice({
  name: "cuurntChat",
  initialState,
  reducers: {
    setCurrentChat: (state, action: PayloadAction<Chat>) => {
      state.value = action.payload;
    },
  },
});

const currentChatReducer = currentChatSlice.reducer; 

export const { setCurrentChat } = currentChatSlice.actions;

export default currentChatReducer;
