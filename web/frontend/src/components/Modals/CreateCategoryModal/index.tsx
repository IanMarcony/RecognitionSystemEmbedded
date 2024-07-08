import { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { CategoryCreate } from "../../../models/category.interface";
import CategoryService from "../../../services/category.service";

const CreateCategoryModal: React.FC<{
  onHide: () => void;
  onSave: () => void;
  show: boolean;
}> = ({ onHide, onSave, show }) => {
  const [category, setCategory] = useState<CategoryCreate>({
    name: "",
    description: "",
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(false);
      return;
    }
    setValidated(true);
    createCategory();
  };

  const createCategory = async () => {
    try {
      await CategoryService.create({ ...category });
      onHide();
      onSave();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      setCategory({
        name: "",
        description: "",
      });
    };
  }, []);

  return (
    <Modal
      show={show}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Category
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Enter name"
              value={category.name}
              onChange={(event) =>
                setCategory({ ...category, name: event.target.value })
              }
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a name
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={category.description}
              onChange={(event) =>
                setCategory({ ...category, description: event.target.value })
              }
              style={{ resize: "none" }}
            />
          </Form.Group>

          <Modal.Footer>
            <Button variant="secondary" onClick={() => onHide()}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              {loading && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
              )}
              {!loading && "Save"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCategoryModal;
