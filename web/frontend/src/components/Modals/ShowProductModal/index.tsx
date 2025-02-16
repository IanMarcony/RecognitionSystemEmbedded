import { useEffect, useState } from "react";
import { Button, Modal, Form, Spinner } from "react-bootstrap";
import { useLoader } from "../../../hooks/useLoader";
import { ProductBase } from "../../../models/product.interface";
import { useProduct } from "../../../hooks/useProduct";
import ProductService from "../../../services/products.service";
import { CategoryBase } from "../../../models/category.interface";
import CategoryService from "../../../services/category.service";

const ShowProductModal: React.FC<{
  onHide: () => void;
  onSave: () => void;
}> = ({ onHide, onSave }) => {
  const [product, setProduct] = useState<ProductBase>({
    name: "",
    description: "",
    id: 0,
    imagem: "",
    category: {
      id: 0,
      name: "",
      description: "",
    },
  });
  const [categories, setCategories] = useState<CategoryBase[]>([]);
  const [selectedCategory, setSelectedCategory] = useState(0);

  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const { productId } = useProduct();
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
    saveProduct();
  };

  const getCategories = async () => {
    setIsLoading(true);
    try {
      const data = await CategoryService.getAll();
      setCategories([...data]);
      setSelectedCategory(
        data.findIndex((category) => category.id === product.category.id),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveProduct = async () => {
    try {
      await ProductService.update(product);
      onHide();
      onSave();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProduct = async () => {
    setIsLoading(true);
    try {
      const result = await ProductService.getOne(productId!);
      setProduct({ ...result });
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, [product.id]);

  useEffect(() => {
    getProduct();
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
          {`Editing ${product.name}`}
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

          <Form.Group controlId="formCategory" className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              aria-label="Categories"
              onChange={(event) =>
                setSelectedCategory(Number(event.target.value))
              }
              value={selectedCategory}
              required
              disabled
            >
              {categories.map((category, i) => (
                <option key={i} value={i}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
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

export default ShowProductModal;
