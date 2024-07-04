import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import App from "../App";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

export default router;
