import { Button, Card, Container, Table } from "react-bootstrap";
import "./styles.scss";
import CategoriesTable from "../../components/Tables/CategoriesTable";
import CategoryService from "../../services/category.service";
import { useEffect, useState } from "react";
import { CategoryBase } from "../../models/category.interface";

const Categories = () => {
  const [categories, setCategories] = useState<CategoryBase[]>([]);

  const getCategories = async () => {
    try {
      const data = await CategoryService.getAll();
      setCategories([...data]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 categories-card max">
        <Card.Header className="d-flex flex-row justify-content-between align-items-center">
          <Card.Title> Categories </Card.Title>
          <Button variant="primary"> New Category </Button>
        </Card.Header>

        <CategoriesTable categories={categories} />
      </Card>
    </div>
  );
};

export default Categories;
