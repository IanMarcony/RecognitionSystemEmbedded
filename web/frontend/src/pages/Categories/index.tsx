import { Button, Card, Container } from "react-bootstrap";
import "./styles.scss";

const Categories = () => {
  return (
    <div className="content">
      <Card className="h-100 categories-card">
        <Card.Header className="d-flex flex-row justify-content-between align-items-center">
          <Card.Title> Categories </Card.Title>
          <Button variant="primary"> New Category </Button>
        </Card.Header>
      </Card>
    </div>
  );
};

export default Categories;
