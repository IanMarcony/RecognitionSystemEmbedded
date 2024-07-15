import "./styles.scss";

const StatusCircle: React.FC<{ status: boolean }> = ({ status }) => (
  <span className={"status-circle " + (status && "active")}></span>
);

export default StatusCircle;
