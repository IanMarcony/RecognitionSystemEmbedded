import { Table } from "react-bootstrap";

const CategoriesTable = () => {
  return (
    <Table striped hover responsive>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>1</td>
          <td>Mark</td>
          <td>Otto</td>
        </tr>
        <tr>
          <td>2</td>
          <td>Jacob</td>
          <td>Thornton</td>
        </tr>
        <tr>
          <td>3</td>
          <td colSpan={2}>Larry the Bird</td>
        </tr>
      </tbody>
    </Table>
  );
};

export default CategoriesTable;
