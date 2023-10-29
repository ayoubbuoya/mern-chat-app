import React from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setCurrentUser } from "../redux/features/currentUser/currentUserSlice";
import { setIsSignedIn } from "../redux/features/loginState/signedInSlice";
import { setCurrentChat } from "../redux/features/currentChat/currentChatSlice";
import Cookies from "js-cookie";

const Contacts: React.FC = () => {
  const currentUser = useAppSelector((state) => state.currentUser.value);
  const contacts = useAppSelector((state) => state.contacts.value);
  const chats = useAppSelector((state) => state.chats.value);
  const dispatch = useAppDispatch();

  // const [contacts, setContacts] = useState<Array<Contact> | null>();

  console.log("Current User", currentUser);

  const handleLogOut = () => {
    console.log("Logging out...");
    dispatch(
      setCurrentUser({
        id: null,
        name: "",
        username: "",
        email: "",
        picture: "",
        createdAt: "",
      })
    );
    dispatch(setIsSignedIn(false));
    // delete aacces token cookie
    Cookies.remove("accessToken");
    console.log("Logged out!");
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
          <svg viewBox="0 0 24 24" className="w-full h-full fill-current">
            <path d="M6.3 12.3l10-10a1 1 0 0 1 1.4 0l4 4a1 1 0 0 1 0 1.4l-10 10a1 1 0 0 1-.7.3H7a1 1 0 0 1-1-1v-4a1 1 0 0 1 .3-.7zM8 16h2.59l9-9L17 4.41l-9 9V16zm10-2a1 1 0 0 1 2 0v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2h6a1 1 0 0 1 0 2H4v14h14v-6z" />
          </svg>
        </button>
      </div>
      {/* End Header */}

      {/* Start Search */}
      <div className="search-box p-4 flex-none">
        <form>
          <div className="relative">
            <label>
              <input
                className="rounded-full py-2 pr-6 pl-10 w-full border border-gray-800 focus:border-gray-700 bg-gray-800 focus:bg-gray-900 focus:outline-none text-gray-200 focus:shadow-md transition duration-300 ease-in"
                type="text"
                placeholder="Search "
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
        </form>
      </div>
      {/* End Search */}

      {/* Start Active Users */}
      <div className="active-users flex flex-row p-2 overflow-auto w-0 min-w-full">
        
        {contacts &&
          contacts.length > 0 &&
          contacts.map((contact, index) => {
            return (
              <div key={index} className="text-sm text-center mr-4">
                <div className="p-1 border-4 border-transparent rounded-full">
                  <div className="w-16 h-16 relative flex flex-shrink-0">
                    <img
                      className="shadow-md rounded-full w-full h-full object-cover"
                      src={contact.picture}
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
        {chats &&
          chats.length > 0 &&
          chats.map((chat, index) => {
            if (chat.messages.length === 0) {
              return null;
            }

            return (
              <div
                key={index}
                className="flex justify-between items-center p-3 hover:bg-gray-800 rounded-lg relative cursor-pointer"
                onClick={() => {
                  dispatch(setCurrentChat(chat));
                }}
              >
                <div className="w-16 h-16 relative flex flex-shrink-0">
                  <img
                    className="shadow-md rounded-full w-full h-full object-cover"
                    src={chat.contact.picture}
                    alt=""
                  />
                </div>
                <div className="flex-auto min-w-0 ml-4 mr-6 hidden md:block group-hover:block">
                  <p>{chat.contact.name}</p>
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
