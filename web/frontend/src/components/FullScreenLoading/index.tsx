import { Container, Modal, Spinner } from "react-bootstrap";
import "./styles.scss";

const FullScreenLoading = () => {
  return (
    <Modal
      show={true}
      backdrop="static"
      keyboard={false}
      centered
      className="loading-modal"
    >
      <Spinner animation="grow" variant="primary" />
    </Modal>
  );
};

export default FullScreenLoading;
