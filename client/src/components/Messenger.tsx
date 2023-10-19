import React from "react";
import Chat from "./Chat";
import Contacts from "./Contacts";


interface User {
  id: number;
  username: string;
  picture: string;
  status: string;
  lastSeen: string;
}

interface MessengerProps {
  currentUser: User;

}

const Messenger: React.FC<MessengerProps> = ({ currentUser }) => {
  return (
    <div className="flex-grow flex flex-row min-h-0">
      <Contacts currentUser={currentUser} />
      <Chat currentUser={currentUser}/>
    </div>
  );
};

export default Messenger;
