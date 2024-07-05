import { Button, Card, Container, Table } from "react-bootstrap";
import "./styles.scss";
import CategoriesTable from "../../components/Tables/CategoriesTable";

const Categories = () => {
  return (
    <div className="content">
      <Card className="h-100 categories-card">
        <Card.Header className="d-flex flex-row justify-content-between align-items-center">
          <Card.Title> Categories </Card.Title>
          <Button variant="primary"> New Category </Button>
        </Card.Header>

        <CategoriesTable />
      </Card>
    </div>
  );
};

export default Categories;
