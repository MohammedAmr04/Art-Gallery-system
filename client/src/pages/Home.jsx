import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const [artworks, setArtworks] = useState([]);
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    category: "",
    priceRange: "",
    status: "",
  });

  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        const response = await fetch(
          "http://localhost:5206/api/Artwork?pageNumber=1&pageSize=10"
        );
        const data = await response.json();
        setArtworks(data.items);
      } catch (error) {
        console.error("Failed to fetch artworks:", error);
      }
    };

    fetchArtworks();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get current time for status filtering
  const now = new Date();

  const filteredArtworks = artworks.filter((artwork) => {
    if (
      filters.category &&
      artwork.category.toLowerCase() !== filters.category.toLowerCase()
    ) {
      return false;
    }

    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split("-").map(Number);
      if (artwork.price < min || artwork.price > max) return false;
    }

    if (filters.status) {
      const start = new Date(artwork.auctionStartTime);
      const end = new Date(artwork.auctionEndTime);

      if (filters.status === "active" && !(now >= start && now <= end))
        return false;
      if (filters.status === "sold" && now > end) return false;
      if (filters.status === "ending" && end - now <= 3600 * 1000 && end > now)
        return true; // less than 1 hour remaining
      if (
        filters.status === "ending" &&
        !(end - now <= 3600 * 1000 && end > now)
      )
        return false;
    }

    return true;
  });

  return (
    <Container className="py-5">
      {/* Filters */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
            >
              <option value="">All Categories</option>
              <option value="abstract">Abstract</option>
              <option value="Sport">Sport</option>
              <option value="string">String</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Price Range</Form.Label>
            <Form.Select
              name="priceRange"
              value={filters.priceRange}
              onChange={handleFilterChange}
            >
              <option value="">All Prices</option>
              <option value="0-500">$0 - $500</option>
              <option value="501-1000">$501 - $1000</option>
              <option value="1001-5000">$1001 - $5000</option>
              <option value="5001-10000">$5001+</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={4}>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
            >
              <option value="">All Status</option>
              <option value="active">Active Auctions</option>
              <option value="ending">Ending Soon</option>
              <option value="sold">Sold</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      {/* Artworks Grid */}
      <Row>
        {filteredArtworks.map((artwork) => (
          <Col key={artwork.id} xs={12} sm={6} md={4} lg={3} className="mb-4">
            <Card>
              <Card.Img
                variant="top"
                src={`http://localhost:5206${artwork.imageUrl}`}
                alt={artwork.title}
                style={{ height: "200px", objectFit: "cover" }}
              />
              <Card.Body>
                <Card.Title>{artwork.title}</Card.Title>
                <Card.Text>
                  <strong>${artwork.price}</strong>
                </Card.Text>
                <div className="d-grid">
                  <Button
                    as={Link}
                    to={user ? `/artwork/${artwork.id}` : "/login"}
                    variant="outline-primary"
                  >
                    View Details
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {filteredArtworks.length === 0 && (
        <div className="text-center py-5">
          <h3>No artworks found matching your filters</h3>
        </div>
      )}
    </Container>
  );
};

export default Home;
