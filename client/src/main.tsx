import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import Root from "./routes/root.tsx";
import Login from "./routes/login.tsx";
import ErrorRoot from "./routes/errorRoot.tsx";
import "./index.css";
import Register from "./routes/register.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
