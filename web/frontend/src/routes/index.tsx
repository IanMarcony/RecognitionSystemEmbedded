import { createBrowserRouter } from "react-router-dom";

import Dashboard from "../pages/Dashboard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Dashboard />,
  },
  {
    path: "*",
    element: <h1>Page not found</h1>,
  },
]);

export default router;
