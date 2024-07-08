import { Outlet } from "react-router-dom";

import "./assets/styles/app.css";
import Navbar from "./components/Navbar";

import { LoaderProvider } from "./contexts/LoaderContext";

const App = () => {
  return (
    <div className="content-wrapper">
      <LoaderProvider>
        <Navbar />
        <Outlet />
      </LoaderProvider>
    </div>
  );
};

export default App;
