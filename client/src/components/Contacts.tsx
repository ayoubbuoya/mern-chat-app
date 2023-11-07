import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentUser } from "../redux/features/currentUser/currentUserSlice";
import { setIsSignedIn } from "../redux/features/loginState/signedInSlice";
import { setCurrentChat } from "../redux/features/currentChat/currentChatSlice";
import { setOtherParticipant } from "../redux/features/otherParticipant/otherParticipantSlice";
import Cookies from "js-cookie";
import Contact from "../types/Contact";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify";

const Contacts: React.FC = () => {
  const currentUser = useAppSelector((state) => state.currentUser.value);
  const contacts = useAppSelector((state) => state.contacts.value);
  const chats = useAppSelector((state) => state.chats.value);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const BACKEND = "http://localhost:7000/";

  const [search, setSearch] = React.useState<string>("");
  const [filteredChats, setFilteredChats] = React.useState(chats);
  // console.log("Current User", currentUser);

  useEffect(() => {
    if (search && search !== "" && chats) {
      setFilteredChats(
        chats.filter((chat) => {
          const otherParticipant = chat.participants.find(
            (participant) => participant.id !== currentUser.id
          );
          if (!otherParticipant) {
            return null;
          }
          return otherParticipant.name
            .toLowerCase()
            .includes(search.toLowerCase());
        })
      );
    } else {
      setFilteredChats(chats);
    }
  }, [search, chats, currentUser]);

  const handleLogOut = () => {
    console.log("Logging out...");
    toast.loading("Logging out...", {
      theme: "colored",
    });
    dispatch(
      setCurrentUser({
        id: "",
        name: "",
        username: "",
        email: "",
        picture: "",
        createdAt: "",
      })
    );
    dispatch(
      setOtherParticipant({
        id: "",
        name: "",
        username: "",
        picture: "",
      })
    );
    dispatch(setIsSignedIn(false));
    // delete aacces token cookie
    Cookies.remove("accessToken");
    console.log("Logged out!");

    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  const handleContactClick = (contact: Contact) => {
    console.log("Contact clicked: ", contact);
    // search chats for chat with the contact id == chats.participants.[0 or 1].id
    const chat = chats?.find((chat) => {
      const participants = chat.participants;
      return (
        participants[0].id === contact.id || participants[1].id === contact.id
      );
    });
    console.log("Chat: ", chat);
    if (chat) {
      dispatch(setCurrentChat(chat));
    } else {
      const user = {
        id: currentUser.id,
        name: currentUser.name,
        username: currentUser.username,
        picture: currentUser.picture,
      };
      dispatch(
        setCurrentChat({
          id: uuidv4(), // generate a random id
          participants: [user, contact],
          messages: [],
          createdAt: new Date().toISOString(),
        })
      );
    }
    dispatch(setOtherParticipant(contact));
  };

  return (
    <section className="flex flex-col flex-none overflow-auto w-24 hover:w-2/5 group lg:max-w-sm md:w-2/5 transition-all duration-300 ease-in-out">
      {/* Start Header */}
      <div className="header p-4 flex flex-row justify-between items-center flex-none">
        <div
          className="w-16 h-16 relative flex flex-shrink-0"
          style={{ filter: "invert(100%)" }}
        >
          <img
            className="rounded-full w-full h-full object-cover"
            alt="ravisankarchinnam"
            src="https://avatars3.githubusercontent.com/u/22351907?s=60"
          />
        </div>
        <p className="text-md font-bold hidden md:block group-hover:block">
          Messenger
        </p>
        <button
          type="button"
          className="block rounded-full hover:bg-gray-700 bg-gray-800 w-10 h-10 p-2 hidden md:block group-hover:block"
          onClick={handleLogOut}
        >
          {/* className="w-full h-full fill-current" */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 512 512"
            className="w-full h-full fill-current"
          >
            {" "}
            <polygon
              fill="var(--ci-primary-color, currentColor)"
              points="77.155 272.034 351.75 272.034 351.75 272.033 351.75 240.034 351.75 240.033 77.155 240.033 152.208 164.98 152.208 164.98 152.208 164.979 129.58 142.353 15.899 256.033 15.9 256.034 15.899 256.034 129.58 369.715 152.208 347.088 152.208 347.087 152.208 347.087 77.155 272.034"
              className="ci-primary"
            />{" "}
            <polygon
              fill="var(--ci-primary-color, currentColor)"
              points="160 16 160 48 464 48 464 464 160 464 160 496 496 496 496 16 160 16"
              className="ci-primary"
            />{" "}
          </svg>
        </button>
      </div>
      {/* End Header */}

      {/* Start Search */}
      <div className="search-box p-4 flex-none">
        <div className="relative">
          <label>
            <input
              className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
              type="text"
              placeholder="Search "
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <span className="absolute top-0 left-0 mt-2 ml-3 inline-block">
              <svg viewBox="0 0 24 24" className="w-6 h-6">
                <path
                  fill="#bbb"
                  d="M16.32 14.9l5.39 5.4a1 1 0 0 1-1.42 1.4l-5.38-5.38a8 8 0 1 1 1.41-1.41zM10 16a6 6 0 1 0 0-12 6 6 0 0 0 0 12z"
                />
              </svg>
            </span>
          </label>
        </div>
      </div>
      {/* End Search */}

      {/* Start Active Users */}
      <div className="active-users flex flex-row p-2 overflow-auto w-0 min-w-full">
        {contacts &&
          contacts.length > 0 &&
          contacts.map((contact, index) => {
            return (
              <div key={index} className="text-sm text-center mr-4">
                <div
                  className="p-1 border-4 border-transparent rounded-full cursor-pointer"
                  onClick={() => handleContactClick(contact)}
                >
                  <div className="w-16 h-16 relative flex flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src={
                        contact.picture.startsWith("http")
                          ? contact.picture
                          : BACKEND + contact.picture
                      }
                      alt=""
                    />
                    <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                      <div className="bg-green-500 rounded-full w-3 h-3"></div>
                    </div>
                  </div>
                </div>
                <p>{contact.name}</p>
              </div>
            );
          })}

        {/* <div className="text-sm text-center mr-4">
          <div className="p-1 border-4 border-transparent rounded-full">
            <div className="w-16 h-16 relative flex flex-shrink-0">
              <img
                className="shadow-md rounded-full w-full h-full object-cover"
                src="https://randomuser.me/api/portraits/men/75.jpg"
                alt=""
              />
              <div className="absolute bg-gray-900 p-1 rounded-full bottom-0 right-0">
                <div className="bg-green-500 rounded-full w-3 h-3"></div>
              </div>
            </div>
          </div>
          <p>Jeff</p>
        </div> */}
      </div>
      {/* End Active Users */}

      {/* Start Chats */}
      <div className="contacts p-2 flex-1 overflow-y-scroll">
        {filteredChats &&
          filteredChats.length > 0 &&
          filteredChats.map((chat, index) => {
            if (chat.messages.length === 0) {
              return null;
            }

            const otherParticipant = chat.participants.find(
              (participant) => participant.id !== currentUser.id
            );

            if (!otherParticipant) {
              return null;
            }

            return (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative cursor-pointer"
                onClick={() => {
                  dispatch(setCurrentChat(chat));
                  console.log("Chat clicked: ", chat);
                  const otherPart = chat.participants.find(
                    (participant) => participant.id !== currentUser.id
                  );
                  if (otherPart) {
                    dispatch(setOtherParticipant(otherPart));
                  }
                }}
              >
                <div className="w-16 h-16 relative flex flex-shrink-0">
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
                <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                  <p>{otherParticipant.name}</p>
                  <div className="flex items-center text-sm text-gray-600">
                    <div className="min-w-0">
                      <p className="truncate">
                        {chat.messages[chat.messages.length - 1] &&
                          chat.messages[chat.messages.length - 1].message}
                      </p>
                    </div>
                    {/*  <p className="ml-2 whitespace-no-wrap">
                      {"10 minutes ago"}
                    </p> */}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {/* End Chats */}
    </section>
  );
};

export default Contacts;
