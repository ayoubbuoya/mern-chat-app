import { configureStore } from "@reduxjs/toolkit";
import currentUserReducer from "./features/currentUser/currentUserSlice";




const store = configureStore({
  reducer: {
    currentUser: currentUserReducer, // This is the reducer for the currentUserSlice
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
