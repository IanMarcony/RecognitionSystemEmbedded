import { Button, Table } from "react-bootstrap";
import type { CategoryBase } from "../../../models/category.interface";

const CategoriesTable: React.FC<{
  categories: CategoryBase[];
  onClickDelete: (index: number) => void;
  onClickEdit: (index: number) => void;
}> = ({ categories, onClickDelete, onClickEdit }) => {
  return (
    <Table striped hover responsive className="mh-100">
      <thead style={{ position: "sticky", top: 0 }}>
        <tr className="table-secondary">
          <th>Id</th>
          <th>Name</th>
          <th>Description</th>
          <th style={{ width: "130px" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {categories.map((obj, index) => (
          <tr key={index}>
            <td> {obj.id} </td>
            <td> {obj.name} </td>
            <td> {obj.description} </td>
            <td>
              <Button
                variant="success"
                onClick={() => onClickEdit(index)}
                style={{ marginRight: "10px" }}
              >
                <i className="fas fa-edit"></i>
              </Button>
              <Button variant="danger" onClick={() => onClickDelete(index)}>
                <i className="far fa-trash-alt"></i>
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default CategoriesTable;
