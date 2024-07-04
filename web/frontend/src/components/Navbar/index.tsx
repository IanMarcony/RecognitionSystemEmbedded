import { Navbar as NavBar, Nav, Container } from "react-bootstrap";

const Navbar = () => {
  return (
    <NavBar bg="primary" data-bs-theme="dark">
      <Container>
        <NavBar.Brand href="/">Belt System</NavBar.Brand>
        <Nav className="me-auto">
          <Nav.Link href="/">Dashboard</Nav.Link>
          <Nav.Link href="/categories">Categories</Nav.Link>
          <Nav.Link href="/objects">Objects</Nav.Link>
        </Nav>
      </Container>
    </NavBar>
  );
};

export default Navbar;
