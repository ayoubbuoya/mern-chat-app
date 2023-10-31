import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Participant {
  id: string;
  name: string;
  username: string;
  picture: string;
}

interface ParticipantState {
  value: Participant;
}

const initialState: ParticipantState = {
  value: {
    id: "",
    name: "",
    username: "",
    picture: "",
  },
};

export const OtherParticipantSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setOtherParticipant: (state, action: PayloadAction<Participant>) => {
      state.value = action.payload;
    },
  },
});

const OtherParticipantReducer = OtherParticipantSlice.reducer; // This is the reducer for the OtherParticipantSlice

export const { setOtherParticipant } = OtherParticipantSlice.actions;

export default OtherParticipantReducer;
