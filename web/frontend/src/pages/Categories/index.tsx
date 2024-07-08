import { Button, Card } from "react-bootstrap";
import "./styles.scss";
import CategoriesTable from "../../components/Tables/CategoriesTable";
import CategoryService from "../../services/category.service";
import { useEffect, useState } from "react";
import { CategoryBase } from "../../models/category.interface";
import CreateCategoryModal from "../../components/Modals/CreateCategoryModal";
import { useLoader } from "../../hooks/useLoader";
import { useCategory } from "../../hooks/useCategory";
import ShowCategoryModal from "../../components/Modals/ShowCategoryModal";

const Categories = () => {
  const [categories, setCategories] = useState<CategoryBase[]>([]);
  const [showCreateCategoryModal, setShowCreateCategoryModal] = useState(false);

  const { categoryId, setCategoryId } = useCategory();

  const { setIsLoading } = useLoader();

  const getCategories = async () => {
    try {
      setIsLoading(true);
      const data = await CategoryService.getAll();
      setCategories([...data]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const onClickDelete = async (index: number) => {
    try {
      setIsLoading(true);
      await CategoryService.delete(categories[index].id);
      getCategories();
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const onClickEdit = (index: number) => {
    setIsLoading(true);
    setCategoryId(categories[index].id);
  };

  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 categories-card max">
        <Card.Header className="d-flex flex-row justify-content-between align-items-center">
          <Card.Title> Categories </Card.Title>
          <Button
            variant="primary"
            onClick={() => setShowCreateCategoryModal(true)}
          >
            {" "}
            New Category{" "}
          </Button>
        </Card.Header>

        <CategoriesTable
          categories={categories}
          onClickEdit={onClickEdit}
          onClickDelete={onClickDelete}
        />
      </Card>
      {showCreateCategoryModal && (
        <CreateCategoryModal
          onHide={() => {
            setShowCreateCategoryModal(false);
          }}
          onSave={() => {
            getCategories();
          }}
        />
      )}

      {categoryId !== undefined && (
        <ShowCategoryModal
          onHide={() => {
            setCategoryId(undefined);
          }}
          onSave={() => {
            getCategories();
          }}
        />
      )}
    </div>
  );
};

export default Categories;
