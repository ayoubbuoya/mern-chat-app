import React, { useEffect } from "react";
import axios from "axios";
import Logo from "../assets/images/logo.jpg";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setIsSignedIn } from "../redux/features/loginState/signedInSlice";
import { setCurrentUser } from "../redux/features/currentUser/currentUserSlice";
import { useNavigate } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import Cookies from "js-cookie";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Register: React.FC = () => {
  const API_URL: string = "http://localhost:7000/api/v1";
  const navigate = useNavigate();
  const currentUser = useAppSelector((state) => state.currentUser.value);
  const isSignedIn = useAppSelector((state) => state.isSignedIn.value);
  const dispatch = useAppDispatch();

  console.log("Is Signed In : ", isSignedIn);
  console.log(currentUser);

  const [name, setName] = React.useState<string>("");
  const [email, setEmail] = React.useState<string>("");
  const [password, setPassword] = React.useState<string>("");
  const [recaptcha, setRecaptcha] = React.useState<string | null>("");

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
      if (isSignedIn || isUser) {
        navigate("/");
        // console.log("Deja signed in!");
      }
    }
    checkIsSignedIn();
  }, []);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Registering...");

    if (!recaptcha) {
      toast.error("Please verify that you are not a robot!", {
        theme: "colored",
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        autoClose: 2000,
      });
      return;
    }

    try {
      const response = await toast.promise(
        axios.post(API_URL + "/auth/register", {
          email,
          password,
          name,
          username: email.split("@")[0],
        }),
        {
          pending: "Registering...",
          success: "Registred successfully!",
          error: "Error creating your account!",
        },
        {
          theme: "dark",
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 2000,
        }
      );

      console.log(response.data);
      // redirect to home page after the toast closes
      setTimeout(() => {
        toast.loading("Redirecting to Login Page...", {
          theme: "colored",
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          autoClose: 1000,
        });
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }, 2000);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="bg-gray-50 dark:bg-gray-900">
      <ToastContainer />
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <a
          href="/"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <img className="w-11 h-11 mr-3 rounded-full" src={Logo} alt="logo" />
          Buoya Chat
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create and account
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={handleRegister}>
              <div>
                <label
                  htmlFor="name"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your name
                </label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Your Name"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    aria-describedby="terms"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-primary-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-primary-600 dark:ring-offset-gray-800"
                    required
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label
                    htmlFor="terms"
                    className="font-light text-gray-500 dark:text-gray-300"
                  >
                    I accept the{" "}
                    <a
                      className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                      href="#"
                    >
                      Terms and Conditions
                    </a>
                  </label>
                </div>
              </div>
              <div className="flex items-center ml-10">
                <ReCAPTCHA
                  theme="dark"
                  sitekey="6LdVrsYoAAAAAFKhteWka4xVZBrK9WCEr5maGygY"
                  onChange={(value) => setRecaptcha(value)}
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
              >
                Create an account
              </button>
              <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <a
                  href="/login"
                  className="font-medium text-primary-600 hover:underline dark:text-primary-500"
                >
                  Login here
                </a>
              </p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Register;
