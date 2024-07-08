import { Outlet } from "react-router-dom";

import "./assets/styles/app.css";
import Navbar from "./components/Navbar";

import { LoaderProvider } from "./contexts/LoaderContext";
import { CategoryProvider } from "./contexts/CategoryContext";

const App = () => {
  return (
    <div className="content-wrapper">
      <LoaderProvider>
        <CategoryProvider>
          <Navbar />
          <Outlet />
        </CategoryProvider>
      </LoaderProvider>
    </div>
  );
};

export default App;
