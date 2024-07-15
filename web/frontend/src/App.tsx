import { Outlet } from "react-router-dom";

import "./assets/styles/app.css";
import Navbar from "./components/Navbar";

import { LoaderProvider } from "./contexts/LoaderContext";
import { CategoryProvider } from "./contexts/CategoryContext";
import { ProductProvider } from "./contexts/ProductContext";
import { ToastProvider } from "./contexts/ToastContext";

const App = () => {
  return (
    <div className="content-wrapper">
      <ToastProvider>
        <LoaderProvider>
          <CategoryProvider>
            <ProductProvider>
              <Navbar />
              <Outlet />
            </ProductProvider>
          </CategoryProvider>
        </LoaderProvider>
      </ToastProvider>
    </div>
  );
};

export default App;
