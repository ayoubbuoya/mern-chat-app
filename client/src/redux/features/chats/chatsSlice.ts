import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  message: string;
  createdAt: string;
}

interface Participant {
  id: string;
  name: string;
  username: string;
  picture: string;
}

interface Chat {
  id: string;
  participants: Participant[];
  messages: Message[];
  createdAt: string;
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
