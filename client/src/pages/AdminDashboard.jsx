import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { BsCheckCircle, BsXCircle } from "react-icons/bs";

const AdminDashboard = () => {
  const { user } = useAuth(); // Get logged-in admin user
  const [activeTab, setActiveTab] = useState("artists"); // Default tab
  const [artistApplications, setArtistApplications] = useState([]);
  const [artworkSubmissions, setArtworkSubmissions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch artist applications
  const fetchArtistApplications = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5206/api/Admin/artists/pending",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();

      // Map API data to internal structure
      const mappedData = data.map((artist) => ({
        id: artist.id,
        name: artist.username,
        email: artist.email,
        status: "pending",
        appliedDate: new Date(artist.createdAt).toLocaleDateString(), // use createdAt if available
      }));
      setArtistApplications(mappedData);
    } catch (error) {
      console.error("Failed to fetch artist applications", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch artwork submissions
  const fetchArtworkSubmissions = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "http://localhost:5206/api/Admin/artworks/pending",
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      const data = await response.json();

      // Map API data to internal structure
      const mappedData = data.map((art) => ({
        id: art.id,
        title: art.title,
        artist: `Artist ID: ${art.artistId}`,
        category: art.category,
        initialPrice: art.price,
        submittedDate: new Date(art.createdAt).toLocaleDateString(),
        status: "pending",
      }));
      setArtworkSubmissions(mappedData);
    } catch (error) {
      console.error("Failed to fetch artwork submissions", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle artist approve/reject
  const handleArtistAction = async (id, action) => {
    try {
      const response = await fetch(
        `http://localhost:5206/api/Admin/artists/${id}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
        fetchArtistApplications(); // Refresh list after action
      } else {
        console.error("Failed to update artist status");
      }
    } catch (error) {
      console.error("Error updating artist status", error);
    }
  };

  // Handle artwork approve/reject
  const handleArtworkAction = async (id, action) => {
    try {
      const response = await fetch(
        `http://localhost:5206/api/Admin/artworks/${id}/${action}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      if (response.ok) {
        fetchArtworkSubmissions(); // Refresh list after action
      } else {
        console.error("Failed to update artwork status");
      }
    } catch (error) {
      console.error("Error updating artwork status", error);
    }
  };

  // Load data on tab change
  useEffect(() => {
    if (activeTab === "artists") {
      fetchArtistApplications();
    } else if (activeTab === "artworks") {
      fetchArtworkSubmissions();
    }
  }, [activeTab]);

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>Admin Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.name}</p>
        </Col>
      </Row>

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="artists">Artist Applications</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="artworks">Artwork Submissions</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              {/* Artist Applications Tab */}
              <Tab.Pane eventKey="artists">
                <Card>
                  <Card.Body>
                    {loading ? (
                      <Spinner animation="border" />
                    ) : artistApplications.length === 0 ? (
                      <p className="text-center text-muted">
                        No artist applications available at the moment.
                      </p>
                    ) : (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Applied Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artistApplications.map((app) => (
                            <tr key={app.id}>
                              <td>{app.name}</td>
                              <td>{app.email}</td>
                              <td>{app.appliedDate}</td>
                              <td>
                                <Badge bg="warning">{app.status}</Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    handleArtistAction(app.id, "approve")
                                  }
                                >
                                  <BsCheckCircle />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleArtistAction(app.id, "reject")
                                  }
                                >
                                  <BsXCircle />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>

              {/* Artwork Submissions Tab */}
              <Tab.Pane eventKey="artworks">
                <Card>
                  <Card.Body>
                    {loading ? (
                      <Spinner animation="border" />
                    ) : artworkSubmissions.length === 0 ? (
                      <p className="text-center text-muted">
                        No artwork submissions available at the moment.
                      </p>
                    ) : (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Artist</th>
                            <th>Category</th>
                            <th>Initial Price</th>
                            <th>Submitted Date</th>
                            <th>Status</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artworkSubmissions.map((sub) => (
                            <tr key={sub.id}>
                              <td>{sub.title}</td>
                              <td>{sub.artist}</td>
                              <td>{sub.category}</td>
                              <td>${sub.initialPrice}</td>
                              <td>{sub.submittedDate}</td>
                              <td>
                                <Badge bg="warning">{sub.status}</Badge>
                              </td>
                              <td>
                                <Button
                                  variant="outline-success"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    handleArtworkAction(sub.id, "approve")
                                  }
                                >
                                  <BsCheckCircle />
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() =>
                                    handleArtworkAction(sub.id, "reject")
                                  }
                                >
                                  <BsXCircle />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    )}
                  </Card.Body>
                </Card>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
};

export default AdminDashboard;
