import { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { CategoryBase } from "../../../models/category.interface";
import CategoryService from "../../../services/category.service";
import { useCategory } from "../../../hooks/useCategory";
import { useLoader } from "../../../hooks/useLoader";

const ShowCategoryModal: React.FC<{
  onHide: () => void;
  onSave: () => void;
}> = ({ onHide, onSave }) => {
  const [category, setCategory] = useState<CategoryBase>({
    name: "",
    description: "",
    id: 0,
  });

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { categoryId } = useCategory();
  const { setIsLoading, isVisible } = useLoader();

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    event.preventDefault();
    event.stopPropagation();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      setValidated(false);
      setLoading(false);
      return;
    }
    setValidated(true);
    saveCategory();
  };

  const saveCategory = async () => {
    try {
      await CategoryService.update(category);
      onHide();
      onSave();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getCategory = async () => {
    setIsLoading(true);
    try {
      const result = await CategoryService.getOne(categoryId!);
      setCategory({ ...result });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategory();
    return () => {
      setCategory({
        name: "",
        description: "",
        id: 0,
      });
    };
  }, []);

  return isVisible ? (
    <></>
  ) : (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {`Editing ${category.name}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated={validated} onSubmit={handleSave}>
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

export default ShowCategoryModal;
