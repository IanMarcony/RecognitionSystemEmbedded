import { Outlet } from "react-router-dom";

import "./assets/styles/app.css";
import Navbar from "./components/Navbar";

const App = () => (
  <div className="content-wrapper">
    <Navbar />
    <Outlet />
  </div>
);

export default App;
