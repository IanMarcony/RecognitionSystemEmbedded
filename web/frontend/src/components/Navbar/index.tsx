import { Navbar as Nav, Container } from "react-bootstrap";

const Navbar = () => {
  return (
    <Nav bg="dark" data-bs-theme="dark" className="bg-body-tertiary">
      <Container>
        <Nav.Brand href="#home"> Dashboard - Belt System</Nav.Brand>
      </Container>
    </Nav>
  );
};

export default Navbar;
