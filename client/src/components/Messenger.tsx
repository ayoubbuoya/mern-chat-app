import React from "react";
import Chat from "./Chat";
import Contacts from "./Contacts";

const Messenger: React.FC = () => {


  return (
    <div className="flex-grow flex flex-row min-h-0">
      <Contacts />
      <Chat />
    </div>
  );
};

export default Messenger;
