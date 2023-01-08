import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Display, { loader as displayLoader } from "./pages/Display";
import ErrorPage from "./pages/Error";
import Home from "./pages/Home";
import NewFile from "./pages/NewFile";
import NewText from "./pages/NewText";
import URL from "./pages/URL";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
        errorElement: <ErrorPage />,
    },
    {
        path: "newtext",
        element: <NewText />,
        errorElement: <ErrorPage />,
    },
    {
        path: "newfile",
        element: <NewFile />,
        errorElement: <ErrorPage />,
    },
    {
        path: "url",
        element: <URL />,
        errorElement: <ErrorPage />,
    },
    {
        path: ":id",
        element: <Display />,
        loader: displayLoader,
        errorElement: <ErrorPage />,
    },
]);

const rootElement = document.getElementById("root")!;
ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
