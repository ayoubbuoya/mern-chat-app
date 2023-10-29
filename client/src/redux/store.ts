import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./features/currentUser/currentUserSlice";
import isSignedInReducer from "./features/loginState/signedInSlice";
import contactsReducer from "./features/contacts/contactsSlice";
import chatsReducer from "./features/chats/chatsSlice";
import currentChatReducer from "./features/currentChat/currentChatSlice";

const store = configureStore({
  reducer: {
    currentUser: currentUserReducer, // This is the reducer for the currentUserSlice
    isSignedIn: isSignedInReducer, // This is the reducer for the isSignedIn
    contacts: contactsReducer,
    chats: chatsReducer,
    currentChat: currentChatReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
