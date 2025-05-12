import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Tab,
  Nav,
  Card,
  Table,
  Button,
  Form,
  Spinner,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ArtistDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("artworks");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // New state for message
  const navigate = useNavigate();
  const [newArtwork, setNewArtwork] = useState({
    title: "",
    description: "",
    initialPrice: "",
    category: "",
    image: null,
    auctionStartTime: "",
    auctionEndTime: "",
    tags: "",
  });
  const fetchArtworks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5206/api/Artwork?pageNumber=1&pageSize=10&artistName=${user.username}`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      if (Array.isArray(response.data.items)) {
        setArtworks(response.data.items);
      } else {
        setMessage({
          text: "Received data is not an array.",
          type: "error",
        });
      }
    } catch (error) {
      console.error("Error fetching artworks:", error);
      setMessage({ text: "Failed to load artworks.", type: "error" });
    } finally {
      setLoading(false);
    }
  };
  // Fetch artworks from API
  useEffect(() => {
    if (activeTab === "artworks") {
      fetchArtworks();
    }
  }, [activeTab, user.token]);

  const handleNewArtworkChange = (e) => {
    const { name, value } = e.target;
    setNewArtwork((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewArtwork((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmitArtwork = async (e) => {
    e.preventDefault();

    const startTimeUTC = new Date(newArtwork.auctionStartTime).toISOString();
    const endTimeUTC = new Date(newArtwork.auctionEndTime).toISOString();

    if (new Date(startTimeUTC) > new Date(endTimeUTC)) {
      setMessage({
        text: "Auction start time cannot be later than auction end time.",
        type: "error",
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append("Title", newArtwork.title);
      formData.append("Description", newArtwork.description);
      formData.append("Price", newArtwork.initialPrice);
      formData.append("Category", newArtwork.category);
      formData.append("Tags", newArtwork.tags); // Comma-separated string
      formData.append("AuctionStartTime", startTimeUTC); // إرسال الوقت بتنسيق UTC
      formData.append("AuctionEndTime", endTimeUTC); // إرسال الوقت بتنسيق UTC
      formData.append("Image", newArtwork.image);

      const response = await axios.post(
        "http://localhost:5206/api/Artwork",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            accept: "text/plain",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Artwork submitted successfully:", response.data);
      setMessage({
        text: "Artwork submitted successfully!",
        type: "success",
      }); // Set success message
      setNewArtwork({
        title: "",
        description: "",
        initialPrice: "",
        category: "",
        image: null,
        auctionStartTime: "",
        auctionEndTime: "",
        tags: "",
      });
    } catch (error) {
      console.error("Error submitting artwork:", error);
      setMessage({
        text: "Failed to submit artwork.",
        type: "error",
      }); // Set error message
    }
  };
  const handleRemoveArtwork = async (id) => {
    console.log(id);
    try {
      const response = await axios.delete(
        `http://localhost:5206/api/Artwork/${id}`,

        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("Artwork removed successfully:", response.data);
      setMessage({
        text: "Artwork is removed",
        type: "success",
      }); // Set success message
      fetchArtworks(); // Refresh the artworks list
    } catch (error) {
      console.error("Error remove artwork:", error);
      setMessage({
        text: "Failed to remove artwork.",
        type: "error",
      }); // Set error message
    }
  };

  const handleWinnerArtwork = async (id, endTime) => {
    const now = new Date();
    const auctionEnd = new Date(endTime);

    // Check if the current time is before the auction end time
    if (now < auctionEnd) {
      setMessage({
        text: "Auction has not ended yet.",
        type: "warning",
      });
      return; // Exit the function if the auction is still ongoing
    }

    try {
      // Call the API to get the winner of the artwork
      const response = await axios.get(
        `http://localhost:5206/api/Artwork/${id}/winner`,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Artwork winner successfully:", response.data);

      // Show the buyer name as a success message
      setMessage({
        text: response.data.buyerName,
        type: "success",
      });

      // Refresh the artwork list after getting the winner
      fetchArtworks();
    } catch (error) {
      console.error("Error getting winner artwork:", error);

      // Show error message if request fails
      setMessage({
        text: "Failed to fetch artwork winner.",
        type: "error",
      });
    }
  };

  return (
    <Container className="py-5">
      <Row className="mb-4">
        <Col>
          <h2>Artist Dashboard</h2>
          <p className="text-muted">Welcome back, {user?.username}</p>
        </Col>
      </Row>

      {/* Display message */}
      {message.text && (
        <Row className="mb-4">
          <Col>
            <p
              style={{
                color: message.type === "success" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {message.text}
            </p>
          </Col>
        </Row>
      )}

      <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
        <Row>
          <Col md={3}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="artworks">My Artworks</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="submit">Submit New Artwork</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>

          <Col md={9}>
            <Tab.Content>
              <Tab.Pane eventKey="artworks">
                <Card>
                  <Card.Body>
                    {loading ? (
                      <div className="text-center py-5">
                        <Spinner animation="border" variant="primary" />
                      </div>
                    ) : (
                      <Table responsive>
                        <thead>
                          <tr>
                            <th>Title</th>
                            <th>Auction Start</th>
                            <th>Auction End</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Tags</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {artworks.map((artwork) => (
                            <tr key={artwork.id}>
                              <td>{artwork.title}</td>

                              <td>
                                {artwork.auctionStartTime
                                  ? new Date(
                                      artwork.auctionStartTime
                                    ).toLocaleDateString("en-GB", {
                                      year: "numeric",
                                      month: "short", // اختصار الشهر زي Jan, Feb, ...
                                      day: "2-digit", // يوم الشهر
                                    })
                                  : "Not set"}
                              </td>
                              <td>
                                {artwork.auctionEndTime
                                  ? new Date(
                                      artwork.auctionEndTime
                                    ).toLocaleString("en-GB", {
                                      year: "numeric",
                                      month: "short", // اختصار الشهر زي Jan, Feb, ...
                                      day: "2-digit", // يوم الشهر
                                    })
                                  : "Not set"}
                              </td>
                              <td>{artwork.category || "Not specified"}</td>
                              <td>${artwork.price || "-"}</td>
                              <td>{artwork.tags.join(", ") || "No tags"}</td>
                              <td>
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="me-2"
                                  onClick={() =>
                                    navigate(`/edit-artwork/${artwork.id}`)
                                  }
                                >
                                  Edit
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  onClick={() =>
                                    handleRemoveArtwork(artwork.id)
                                  }
                                  size="sm"
                                >
                                  Remove
                                </Button>
                                <Button
                                  variant="outline-primary"
                                  onClick={() =>
                                    handleWinnerArtwork(
                                      artwork.id,
                                      artwork.auctionEndTime
                                    )
                                  }
                                  size="sm"
                                >
                                  winner
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

              <Tab.Pane eventKey="submit">
                <Card>
                  <Card.Body>
                    <Form onSubmit={handleSubmitArtwork}>
                      <Form.Group className="mb-3">
                        <Form.Label>Title</Form.Label>
                        <Form.Control
                          type="text"
                          name="title"
                          value={newArtwork.title}
                          onChange={handleNewArtworkChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          name="description"
                          value={newArtwork.description}
                          onChange={handleNewArtworkChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Initial Price ($)</Form.Label>
                        <Form.Control
                          type="number"
                          name="initialPrice"
                          value={newArtwork.initialPrice}
                          onChange={handleNewArtworkChange}
                          required
                          min="0"
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Category</Form.Label>
                        <Form.Select
                          name="category"
                          value={newArtwork.category}
                          onChange={handleNewArtworkChange}
                          required
                        >
                          <option value="">Select a category</option>
                          <option value="portrait">Portrait</option>
                          <option value="landscape">Landscape</option>
                          <option value="abstract">Abstract</option>
                          <option value="modern">Modern</option>
                        </Form.Select>
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Tags (comma separated)</Form.Label>
                        <Form.Control
                          type="text"
                          name="tags"
                          value={newArtwork.tags}
                          onChange={handleNewArtworkChange}
                          placeholder="e.g. nature, mountains, sky"
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Auction Start Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="auctionStartTime"
                          value={newArtwork.auctionStartTime}
                          onChange={handleNewArtworkChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-3">
                        <Form.Label>Auction End Time</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          name="auctionEndTime"
                          value={newArtwork.auctionEndTime}
                          onChange={handleNewArtworkChange}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label>Image</Form.Label>
                        <Form.Control
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          required
                        />
                      </Form.Group>

                      <div className="d-grid">
                        <Button variant="primary" type="submit" size="lg">
                          Submit Artwork
                        </Button>
                      </div>
                    </Form>
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

export default ArtistDashboard;
