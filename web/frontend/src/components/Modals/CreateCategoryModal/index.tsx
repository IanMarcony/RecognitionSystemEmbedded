import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { CategoryCreate } from "../../../models/category.interface";
import CategoryService from "../../../services/category.service";

const CreateCategoryModal: React.FC<{
  onHide: () => void;
  show: boolean;
  onSave: () => void;
}> = (props) => {
  const [category, setCategory] = useState<CategoryCreate>({
    name: "",
    description: "",
  });

  const [validated, setValidated] = useState(false);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
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
      props.onHide();
      props.onSave();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Modal
      {...props}
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
            <Button variant="secondary" onClick={props.onHide}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Save
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateCategoryModal;
