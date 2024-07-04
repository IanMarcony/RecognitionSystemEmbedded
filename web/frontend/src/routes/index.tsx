import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import App from "../App";
import Categories from "../pages/Categories";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
      {
        path: "/categories",
        element: <Categories />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

export default router;
