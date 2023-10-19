import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import store from "./redux/store.ts";
import { Provider } from "react-redux";
import Root from "./routes/root.tsx";
import Login from "./routes/login.tsx";
import ErrorRoot from "./routes/errorRoot.tsx";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorRoot />,
  },
  {
    path: "/login",
    element: <Login />,
    errorElement: <ErrorRoot />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
