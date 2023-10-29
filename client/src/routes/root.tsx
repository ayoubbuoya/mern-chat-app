import { useEffect } from "react";
import Messenger from "../components/Messenger";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setIsSignedIn } from "../redux/features/loginState/signedInSlice";
import { setCurrentUser } from "../redux/features/currentUser/currentUserSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

function Root() {
  const API_URL: string = "http://localhost:7000/api/v1";
  const isSignedIn = useAppSelector((state) => state.isSignedIn.value);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  console.log("Is Signed In : ", isSignedIn);

  // check accessToken by sending a request to the server
  // if accessToken is valid, then set isSignedIn to true
  // if accessToken is invalid, then set isSignedIn to false
  async function getUser() {
    console.log("Getting user...");
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      console.log("No access token found!");
      return false;
    }
    console.log(accessToken);
    // axios get request to /auth/me and sending accessToken cookie with it to verify user
    try {
      const response = await axios.get(API_URL + "/auth/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      console.log(response.data);
      dispatch(setCurrentUser(response.data.user));
      dispatch(setIsSignedIn(true));
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  useEffect(() => {
    async function checkIsSignedIn() {
      const isUser = await getUser();
      if (!isUser) {
        navigate("/login");
        // console.log("Not signed in!");
      }
    }
    checkIsSignedIn();
  }, []);

  return (
    <div className="h-screen w-full flex antialiased text-gray-200 bg-gray-900 overflow-hidden">
      <Messenger />
    </div>
  );
}

export default Root;
