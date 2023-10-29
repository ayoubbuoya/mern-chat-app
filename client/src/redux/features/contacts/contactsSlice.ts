import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Contact {
  id: string;
  name: string;
  username: string;
  picture: string;
}

interface ContactsState {
  value: Contact[];
}

const initialState: ContactsState = {
  value: [
    {
      id: "",
      name: "",
      username: "",
      picture: "",
    },
  ],
};

export const contactsSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setContacts: (state, action: PayloadAction<Contact[]>) => {
      state.value = action.payload;
    },
  },
});

const contactsReducer = contactsSlice.reducer; // This is the reducer for the contactsSlice

export const { setContacts } = contactsSlice.actions;

export default contactsReducer;
