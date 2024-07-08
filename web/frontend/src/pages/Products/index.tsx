import { Button, Card } from "react-bootstrap";
import "./styles.scss";
import { useEffect, useState } from "react";
import { useLoader } from "../../hooks/useLoader";
import ProductService from "../../services/products.service";
import ProductsTable from "../../components/Tables/ProductsTable";
import { ProductBase } from "../../models/product.interface";
import { useProduct } from "../../hooks/useProduct";
import ShowProductModal from "../../components/Modals/ShowProductModal";
import CreateProductModal from "../../components/Modals/CreateProductModal";

const Products = () => {
  const [products, setProducts] = useState<ProductBase[]>([]);
  const [showCreateProductModal, setShowCreateProductModal] = useState(false);

  const { productId, setProductId } = useProduct();

  const { setIsLoading } = useLoader();

  const getProducts = async () => {
    try {
      setIsLoading(true);
      const data = await ProductService.getAll();
      setProducts([...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const onClickDelete = async (index: number) => {
    try {
      setIsLoading(true);
      await ProductService.delete(products[index].id);
      getProducts();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickEdit = (index: number) => {
    setIsLoading(true);
    setProductId(products[index].id);
  };

  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 categories-card max">
        <Card.Header className="d-flex flex-row justify-content-between align-items-center">
          <Card.Title> Products </Card.Title>
          <Button
            variant="primary"
            onClick={() => setShowCreateProductModal(true)}
          >
            {" "}
            New Product{" "}
          </Button>
        </Card.Header>

        <ProductsTable
          products={products}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
        />
      </Card>
      {showCreateProductModal && (
        <CreateProductModal
          onHide={() => {
            setShowCreateProductModal(false);
          }}
          onSave={() => {
            getProducts();
          }}
        />
      )}

      {productId !== undefined && (
        <ShowProductModal
          onHide={() => {
            setProductId(undefined);
          }}
          onSave={() => {
            getProducts();
          }}
        />
      )}
    </div>
  );
};

export default Products;
