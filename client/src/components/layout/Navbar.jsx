import { Link } from "react-router-dom";
import { Navbar as BsNavbar, Nav, Container, Button } from "react-bootstrap";
import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <BsNavbar bg="dark" variant="dark" expand="lg" className="mb-4">
      <Container>
        <BsNavbar.Brand as={Link} to="/">
          Art Gallery
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="basic-navbar-nav" />
        <BsNavbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            {!user ? (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            ) : (
              <>
                {user.role === "Admin" && (
                  <Nav.Link as={Link} to="/admin/dashboard">
                    Admin Dashboard
                  </Nav.Link>
                )}
                {user.role === "Artist" && (
                  <Nav.Link as={Link} to="/artist/dashboard">
                    Artist Dashboard
                  </Nav.Link>
                )}
                <Button
                  variant="outline-light"
                  onClick={logout}
                  className="ms-2"
                >
                  Logout
                </Button>
              </>
            )}
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  );
};

export default Navbar;
