import { Card, Container } from "react-bootstrap";
import "./styles.scss";

const Dashboard = () => {
  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 dashboard-card max d-flex flex-column">
        <Card className="w-auto h-auto">
          <Card.Header>
            <Card.Title>Live Time Camera</Card.Title>
          </Card.Header>
          <Card.Body>
            <Container>
              <h2>Welcome to your admin panel</h2>
            </Container>
          </Card.Body>
        </Card>
      </Card>
    </div>
  );
};

export default Dashboard;
