import { useEffect } from "react";
import Messenger from "../components/Messenger";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setIsSignedIn } from "../redux/features/loginState/signedInSlice";
import { setCurrentUser } from "../redux/features/currentUser/currentUserSlice";
import { setIsLoading } from "../redux/features/isLoading/isLoadingSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";

function Root() {
  const API_URL: string = "http://localhost:7000/api/v1";
  const isSignedIn = useAppSelector((state) => state.isSignedIn.value);
  const isLoading = useAppSelector((state) => state.isLoading.value);
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
      dispatch(setIsLoading(false));
      return true;
    } catch (error) {
      console.log(error);
      dispatch(setIsSignedIn(false));
      dispatch(setIsLoading(true));
      toast.error("Please sign in to continue!", {
        theme: "colored",
      });
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

  if (isLoading) {
    <div className="rounded-md h-12 w-12 border-4 border-t-4 border-blue-500 animate-spin absolute"></div>;
  }

  return (
    <div className="h-screen w-full flex antialiased text-gray-200 bg-gray-900 overflow-hidden">
      <ToastContainer />
      <Messenger />
    </div>
  );
}

export default Root;
