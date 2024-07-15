import { Card } from "react-bootstrap";
import "./styles.scss";
import CameraCard from "../../components/CameraCard";

const Dashboard = () => {
  return (
    <div className="content mh-100">
      <Card className="h-100 mh-100 dashboard-card max d-flex flex-column">
        <CameraCard />
      </Card>
    </div>
  );
};

export default Dashboard;
