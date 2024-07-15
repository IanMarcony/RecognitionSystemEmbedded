import React from "react";
import Toast from "react-bootstrap/Toast";

interface Props {
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
}

const ToastNotification: React.FC<Props> = ({ type, content }) => {
  return (
    <Toast className="d-inline-block m-1" bg={type.toLowerCase()}>
      <Toast.Body className={type === "Dark" ? "text-white" : ""}>
        {content}
      </Toast.Body>
    </Toast>
  );
};

export default ToastNotification;
