import { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { ProductCreate } from "../../../models/product.interface";
import ProductService from "../../../services/products.service";

const CreateProductModal: React.FC<{
  onHide: () => void;
  onSave: () => void;
}> = ({ onHide, onSave }) => {
  const [product, setProduct] = useState<ProductCreate>({
    name: "",
    description: "",
    id_category: 0,
    imagem: "",
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
      setLoading(false);
      return;
    }
    setValidated(true);
    createProduct();
  };

  const createProduct = async () => {
    try {
      await ProductService.create({ ...product });
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
      setProduct({
        name: "",
        description: "",
        id_category: 0,
        imagem: "",
      });
    };
  }, []);

  return (
    <Modal
      show={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
      onHide={onHide}
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Create New Product
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated={validated} onSubmit={handleSave}>
          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              placeholder="Enter name"
              value={product.name}
              onChange={(event) =>
                setProduct({ ...product, name: event.target.value })
              }
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a name
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formName">
            <Form.Label>Image</Form.Label>
            <Form.Control
              placeholder="Enter Image"
              value={product.imagem}
              onChange={(event) =>
                setProduct({ ...product, imagem: event.target.value })
              }
              required
            />
            <Form.Control.Feedback type="invalid">
              Please choose a image
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={product.description}
              onChange={(event) =>
                setProduct({ ...product, description: event.target.value })
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

export default CreateProductModal;
