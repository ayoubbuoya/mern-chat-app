import React, { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import axios from "axios";
import Cookies from "js-cookie";
import { setCurrentChat } from "../redux/features/currentChat/currentChatSlice";
import { ToastContainer, toast } from "react-toastify";
import { Socket, io } from "socket.io-client";
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { setOtherParticipant } from "../redux/features/otherParticipant/otherParticipantSlice";

let socket: Socket<DefaultEventsMap, DefaultEventsMap>;

const Chat: React.FC = () => {
  const API_URL: string = "http://localhost:7000/api/v1";
  const BACKEND: string = "http://localhost:7000/";
  const currentChat = useAppSelector((state) => state.currentChat.value);
  const currentUser = useAppSelector((state) => state.currentUser.value);
  const otherParticipant = useAppSelector(
    (state) => state.otherParticipant.value
  );
  // const chats = useAppSelector((state) => state.chats.value);
  const dispatch = useAppDispatch();
  const chatBodyRef = useRef<HTMLDivElement>(null);

  const [msg, setMsg] = useState<string>("");
  const [socketConnected, setSocketConnected] = useState<boolean>(false);

  console.log("Current Chat", currentChat);

  useEffect(() => {
    if (!socketConnected) {
      socket = io("http://localhost:7000");
      socket.emit("setup", currentUser);
      socket.on("connected", () => {
        console.log("Connected to socket.io");
        setSocketConnected(true);
      });
    } else {
      console.log("Socket already connected");
    }
  }, []);

  useEffect(() => {
    // Scroll to the bottom of the chat-body div
    chatBodyRef.current?.scrollIntoView({ behavior: "smooth" });
    if (currentChat) {
      // const room_id = "test_room";
      console.log("Joining chat room : ", currentChat.id);
      socket.emit("join_chat", currentChat.id);

      socket.on("new_message", (data) => {
        console.log("New Message Sended : ", data);
        dispatch(
          setCurrentChat({
            id: currentChat.id,
            participants: currentChat.participants,
            messages: [
              ...currentChat.messages,
              {
                id: data.chat.id,
                sender_id: data.chat.sender_id,
                receiver_id: data.chat.receiver_id,
                message: data.chat.message,
                createdAt: data.chat.createdAt,
              },
            ],
            createdAt: currentChat.createdAt,
          })
        );
        const otherParticip = currentChat.participants.find(
          (participant) => participant.id !== currentUser.id
        );
        if (!otherParticip) {
          return;
        }
        dispatch(setOtherParticipant(otherParticip));
      });
    }
  }, [currentChat]);

  if (!currentChat) {
    return (
      <section className="flex flex-col flex-auto border-l border-gray-800"></section>
    );
  }

  const handleSendMessage = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    console.log("Sending message...");

    const accessToken = Cookies.get("accessToken");

    if (!accessToken) {
      console.log("No access token found!");
      return;
    }

    console.log("Access Token : ", accessToken);

    const data = {
      receiver_username: otherParticipant.username,
      message: msg,
    };

    // axios request to server to send message
    const msgId =
      currentUser.username +
      "_" +
      otherParticipant.username +
      "_" +
      Date.now().toString();

    try {
      // add message to current chat localy
      dispatch(
        setCurrentChat({
          id: currentChat.id,
          participants: currentChat.participants,
          messages: [
            ...currentChat.messages,
            {
              id: msgId,
              sender_id: currentUser.id,
              receiver_id: otherParticipant.id,
              message: msg,
              createdAt: new Date().toISOString(),
            },
          ],
          createdAt: currentChat.createdAt,
        })
      );
      // send message socket
      socket.emit("send_message", {
        user: {
          id: socket.id,
          room: currentChat.id,
          username: currentUser.username,
        },
        chat: {
          id: msgId,
          sender_id: currentUser.id,
          receiver_id: otherParticipant.id,
          message: msg,
          createdAt: new Date().toISOString(),
        },
      });
      setMsg("");
      // Scroll to the bottom of the chat-body div
      // chatBodyRef.current?.scrollIntoView({ behavior: "smooth" });

      const response = await axios.post(API_URL + "/chats/send", data, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message!");
      // remove the added message from current chat
      dispatch(
        setCurrentChat({
          id: currentChat.id,
          participants: currentChat.participants,
          messages: currentChat.messages.filter((message) => message.id !== msgId),
          createdAt: currentChat.createdAt,
        })
      );
    }
  };

  return (
    <section className="flex flex-col flex-auto border-l border-gray-800 overflow-y-scroll">
      <ToastContainer />
      <div className="chat-header mb-7 px-6 py-4 flex flex-row flex-none justify-between items-center shadow">
        <div className="flex">
          <div className="w-12 h-12 mr-4 relative flex flex-shrink-0">
            <img
              className="shadow-md rounded-full w-full h-full object-cover"
              src={
                otherParticipant.picture.startsWith("http")
                  ? otherParticipant.picture
                  : BACKEND + otherParticipant.picture
              }
              alt=""
            />
          </div>
          <div className="text-sm">
            <p className="font-bold space-x-2">{otherParticipant.name}</p>
            <p>Active 1h ago</p>
          </div>
        </div>

        <div className="flex">
          <a
            href="#"
            className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2"
          >
            <svg
              viewBox="0 0 20 20"
              className="w-full h-full fill-current text-blue-500"
            >
              <path d="M11.1735916,16.8264084 C7.57463481,15.3079672 4.69203285,12.4253652 3.17359164,8.82640836 L5.29408795,6.70591205 C5.68612671,6.31387329 6,5.55641359 6,5.00922203 L6,0.990777969 C6,0.45097518 5.55237094,3.33066907e-16 5.00019251,3.33066907e-16 L1.65110039,3.33066907e-16 L1.00214643,8.96910337e-16 C0.448676237,1.13735153e-15 -1.05725384e-09,0.445916468 -7.33736e-10,1.00108627 C-7.33736e-10,1.00108627 -3.44283713e-14,1.97634814 -3.44283713e-14,3 C-3.44283713e-14,12.3888407 7.61115925,20 17,20 C18.0236519,20 18.9989137,20 18.9989137,20 C19.5517984,20 20,19.5565264 20,18.9978536 L20,18.3488996 L20,14.9998075 C20,14.4476291 19.5490248,14 19.009222,14 L14.990778,14 C14.4435864,14 13.6861267,14.3138733 13.2940879,14.7059121 L11.1735916,16.8264084 Z" />
            </svg>
          </a>
          <a
            href="#"
            className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 ml-4"
          >
            <svg
              viewBox="0 0 20 20"
              className="w-full h-full fill-current text-blue-500"
            >
              <path d="M0,3.99406028 C0,2.8927712 0.894513756,2 1.99406028,2 L14.0059397,2 C15.1072288,2 16,2.89451376 16,3.99406028 L16,16.0059397 C16,17.1072288 15.1054862,18 14.0059397,18 L1.99406028,18 C0.892771196,18 0,17.1054862 0,16.0059397 L0,3.99406028 Z M8,14 C10.209139,14 12,12.209139 12,10 C12,7.790861 10.209139,6 8,6 C5.790861,6 4,7.790861 4,10 C4,12.209139 5.790861,14 8,14 Z M8,12 C9.1045695,12 10,11.1045695 10,10 C10,8.8954305 9.1045695,8 8,8 C6.8954305,8 6,8.8954305 6,10 C6,11.1045695 6.8954305,12 8,12 Z M16,7 L20,3 L20,17 L16,13 L16,7 Z" />
            </svg>
          </a>
          <a
            href="#"
            className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 ml-4"
          >
            <svg
              viewBox="0 0 20 20"
              className="w-full h-full fill-current text-blue-500"
            >
              <path d="M2.92893219,17.0710678 C6.83417511,20.9763107 13.1658249,20.9763107 17.0710678,17.0710678 C20.9763107,13.1658249 20.9763107,6.83417511 17.0710678,2.92893219 C13.1658249,-0.976310729 6.83417511,-0.976310729 2.92893219,2.92893219 C-0.976310729,6.83417511 -0.976310729,13.1658249 2.92893219,17.0710678 Z M9,11 L9,10.5 L9,9 L11,9 L11,15 L9,15 L9,11 Z M9,5 L11,5 L11,7 L9,7 L9,5 Z" />
            </svg>
          </a>
        </div>
      </div>
      <div className="chat-body h-full overflow-y-scroll">
        {currentChat.messages &&
          currentChat.messages.length > 0 &&
          currentChat.messages.map((message, index) => (
            <div key={index} className="msg-container p-4">
              {message.sender_id === currentUser.id ? (
                <div className="flex flex-row justify-start">
                  <div className="messages text-sm text-gray-700 grid grid-flow-row gap-2">
                    <div className="flex items-center group">
                      <p className="px-6 py-3 rounded-xl bg-blue-700 max-w-xs lg:max-w-xl text-gray-200 overscroll-auto">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-row justify-end">
                  <div className="messages text-sm text-white grid grid-flow-row gap-2">
                    <div className="flex items-center flex-row-reverse group">
                      <p className="px-6 py-3 rounded-xl bg-gray-800 max-w-xs lg:max-w-xl">
                        {message.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        <div ref={chatBodyRef}></div>
      </div>

      <div className="chat-footer flex-[999_999_0%] flex w-full flex-col justify-end">
        <div className="flex flex-row items-center pt-4 pb-2 px-3">
          <form className="relative flex-grow" onSubmit={handleSendMessage}>
            <label>
              <input
                className="rounded-full py-2 pl-3 pr-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                type="text"
                placeholder="Aa"
                value={msg}
                onChange={(e) => setMsg(e.target.value)}
              />
              <button
                type="submit"
                className="absolute top-0 right-0 mt-1 mr-3 flex flex-shrink-0 focus:outline-none block text-blue-600 hover:text-blue-700 w-8 h-8"
              >
                <svg
                  className="svg-icon w-full h-full fill-current"
                  viewBox="0 0 20 20"
                >
                  <path d="M12.522,10.4l-3.559,3.562c-0.172,0.173-0.451,0.176-0.625,0c-0.173-0.173-0.173-0.451,0-0.624l3.248-3.25L8.161,6.662c-0.173-0.173-0.173-0.452,0-0.624c0.172-0.175,0.451-0.175,0.624,0l3.738,3.736C12.695,9.947,12.695,10.228,12.522,10.4 M18.406,10c0,4.644-3.764,8.406-8.406,8.406c-4.644,0-8.406-3.763-8.406-8.406S5.356,1.594,10,1.594C14.643,1.594,18.406,5.356,18.406,10M17.521,10c0-4.148-3.374-7.521-7.521-7.521c-4.148,0-7.521,3.374-7.521,7.521c0,4.147,3.374,7.521,7.521,7.521C14.147,17.521,17.521,14.147,17.521,10"></path>
                </svg>
              </button>
            </label>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Chat;
