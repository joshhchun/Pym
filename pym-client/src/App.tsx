import { MantineProvider } from "@mantine/core";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import "./index.css";

import Display, { loader as displayLoader } from "./pages/Display";
import Home from "./pages/Home";
import NewFile from "./pages/NewFile";
import NewText from "./pages/NewText";
import URL from "./pages/URL";
import NavBar from "./components/NavBar";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "newtext",
        element: <NewText />,
    },
    {
        path: "newfile",
        element: <NewFile />,
    },
    {
        path: "newurl",
        element: <URL />,
    },
    {
        path: ":id",
        element: <Display />,
        loader: displayLoader,
    },
]);

export default function App() {
    return (
        <MantineProvider
            theme={{
                colorScheme: "dark",
                globalStyles: (theme) => ({
                    ".filepond--root .filepond--panel-root": {
                        backgroundColor: theme.colors.dark[6],
                        height: "15rem",
                    },
                    ".filepond--root .filepond--drop-label": {
                        color: theme.colors.dark[0],
                        height: "15rem",
                    },
                }),
            }}
            withGlobalStyles
            withNormalizeCSS
        >
            <NavBar />
            <RouterProvider router={router} />
        </MantineProvider>
    );
}
