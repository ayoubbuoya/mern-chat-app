import Navbar from "../components/Navbar";
import Messenger from "../components/Messenger";
import { useState } from "react";

function Root() {
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: "ayoub",
    picture: "person/1.jpeg",
    status: "active",
    lastSeen: "3 minutes ago",
  });

  const [contacts, setContacts] = useState([{}, {}]);

  return (
    <div className="h-screen w-full flex antialiased text-gray-200 bg-gray-900 overflow-hidden">
      <Messenger currentUser={currentUser} />
    </div>
  );
}

export default Root;
