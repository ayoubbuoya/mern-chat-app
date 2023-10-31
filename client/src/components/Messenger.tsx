import React from "react";
import Chat from "./Chat";
import Contacts from "./Contacts";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setContacts } from "../redux/features/contacts/contactsSlice";
import axios from "axios";
import Cookies from "js-cookie";
import { setChats } from "../redux/features/chats/chatsSlice";
import { setIsLoading } from "../redux/features/isLoading/isLoadingSlice";
// import { setOtherParticipant } from "../redux/features/otherParticipant/otherParticipantSlice";

const Messenger: React.FC = () => {
  const API_URL: string = "http://localhost:7000/api/v1";
  const isLoading = useAppSelector((state) => state.isLoading.value);
  const chats = useAppSelector((state) => state.chats.value);
  const contacts = useAppSelector((state) => state.contacts.value);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setIsLoading(true));

    async function getContacts() {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.log("No access token found!");
        return false;
      }
      console.log(accessToken);
      // axios get request to /contacts and sending accessToken cookie with it to verify user
      try {
        const response = await axios.get(API_URL + "/contacts", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Contacts : ", response.data.contacts);
        dispatch(setContacts(response.data.contacts));
        // dispatch(setOtherParticipant());
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }

    async function getChats() {
      const accessToken = Cookies.get("accessToken");
      if (!accessToken) {
        console.log("No access token found!");
        return false;
      }

      try {
        const response = await axios.get(API_URL + "/chats", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Chats : ", response.data.chats);
        dispatch(setChats(response.data.chats));
        return true;
      } catch (error) {
        console.log(error);
        return false;
      }
    }
    getContacts();
    getChats();

    if (chats && chats.length > 0 && contacts.length > 0) {
      dispatch(setIsLoading(false));
    }
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>
    );
  }

  return (
    <div className="flex-grow flex flex-row min-h-0">
      <Contacts />
      <Chat />
    </div>
  );
};

export default Messenger;
