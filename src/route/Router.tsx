import { createBrowserRouter } from "react-router-dom";
import Layout from "./Layout.tsx";
import Home from "../components/Home.tsx"
import Error from "./Error.tsx"

export const router = createBrowserRouter([
    {
        path: "/",
        element: <Layout/>,
        errorElement: <Error/>,
        children: [
            {
                index: true,
                element: <Home/>,
            },
        ],
    },
]);