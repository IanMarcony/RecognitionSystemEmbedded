import { Table } from "react-bootstrap";
import type { CategoryBase } from "../../../models/category.interface";

const CategoriesTable: React.FC<{ categories: CategoryBase[] }> = ({
  categories,
}) => {
  return (
    <Table striped hover responsive className="mh-100">
      <thead style={{ position: "sticky", top: 0 }}>
        <tr className="table-secondary">
          <th>Id</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((obj) => (
          <tr>
            <td> {obj.id} </td>
            <td> {obj.name} </td>
            <td> {obj.description} </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CategoriesTable;
