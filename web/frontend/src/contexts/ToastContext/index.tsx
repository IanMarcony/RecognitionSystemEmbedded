import React, { ReactNode, createContext, useState } from "react";
import { ToastContainer } from "react-bootstrap";
import ToastNotification from "../../components/ToastNotification";

type Notification = {
  type:
    | "Primary"
    | "Secondary"
    | "Success"
    | "Danger"
    | "Warning"
    | "Info"
    | "Light"
    | "Dark";
  content: string;
};

type ToastContextT = {
  addNotification: (notification: Notification) => void;
};

type ToastContextProvider = {
  children: ReactNode;
};

export const ToastContext = createContext<ToastContextT | undefined>(undefined);

export const ToastProvider: React.FC<ToastContextProvider> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (notification: Notification) => {
    setNotifications([...notifications, notification]);
    setTimeout(() => setNotifications(notifications.slice(1)), 2000);
  };

  const contextValue: ToastContextT = {
    addNotification,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      <ToastContainer position="top-end" className="p-3" style={{ zIndex: 10 }}>
        {notifications.map((n, i) => (
          <ToastNotification content={n.content} type={n.type} key={i} />
        ))}
      </ToastContainer>
      {children}
    </ToastContext.Provider>
  );
};
