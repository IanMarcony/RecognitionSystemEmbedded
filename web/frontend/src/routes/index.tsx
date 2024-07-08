import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import App from "../App";
import Categories from "../pages/Categories";
import Products from "../pages/Products";

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
      {
        path: "/products",
        element: <Products />,
      },
    ],
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

export default router;
