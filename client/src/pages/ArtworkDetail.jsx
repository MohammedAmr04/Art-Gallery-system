import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Alert,
  Badge,
  ListGroup,
} from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { format } from "date-fns";
import { HubConnectionBuilder } from "@microsoft/signalr";

const ArtworkDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();

  const [artwork, setArtwork] = useState(null);
  const [bidAmount, setBidAmount] = useState("");
  const [error, setError] = useState("");
  const [connection, setConnection] = useState(null);
  const [bidHistory, setBidHistory] = useState([]);

  const artworkRef = useRef(null);

  const fetchArtwork = async () => {
    try {
      const res = await fetch(`http://localhost:5206/api/Artwork/${id}`);
      if (!res.ok) throw new Error("Failed to fetch artwork");
      const data = await res.json();
      setArtwork(data);
      artworkRef.current = data;
    } catch (err) {
      console.error(err.message);
    }
  };

  const fetchBids = async () => {
    try {
      const res = await fetch(`http://localhost:5206/api/Auction/bids/${id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to fetch bids");
      const data = await res.json();
      setBidHistory(data);
    } catch (err) {
      console.error(err.message);
    }
  };

  useEffect(() => {
    fetchBids();
    fetchArtwork();
  }, []);

  useEffect(() => {
    if (!user?.token) return;

    const connect = new HubConnectionBuilder()
      .withUrl("http://localhost:5206/hubs/auction", {
        accessTokenFactory: () => user.token,
      })
      .withAutomaticReconnect()
      .build();

    setConnection(connect);

    connect
      .start()
      .then(() => {
        console.log("Connected to SignalR hub");

        if (artworkRef.current) {
          connect.invoke("JoinAuction", artworkRef.current.id);
        }

        connect.on("BidPlaced", (newBid) => {
          if (newBid.artworkId === artworkRef.current?.id) {
            setBidHistory((prev) => [...prev, newBid]);
            // setArtwork((prev) => ({
            //   ...prev,
            //   currentBid: newBid.amount,
            // }));
          }
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      connect.stop();
    };
  }, [user.token]);

  const handleBid = async (e) => {
    e.preventDefault();
    const bidValue = parseFloat(bidAmount);
    if (isNaN(bidValue)) {
      setError("Please enter a valid amount");
      return;
    }
    if (bidValue <= latestBid) {
      setError("Bid must be at least $10 higher than current bid");
      return;
    }
    if (bidValue < artwork.price) {
      setError("Bid must be at least the initial price");
      return;
    }

    const newBid = {
      artworkId: artwork.id,
      amount: bidValue,
      buyerId: user?.id,
      bidTime: new Date().toISOString(),
    };

    try {
      const response = await fetch(
        "http://localhost:5206/api/Auction/place-bid",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify(newBid),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to place bid");
      }

      setBidAmount("");
      setError("");
    } catch (err) {
      console.error("Error placing bid:", err);
      setError(err.message);
    }
  };

  if (!artwork) {
    return <div className="text-center py-5">Loading...</div>;
  }

  const endTime = new Date(artwork.auctionEndTime);
  const isAuctionEnded = isNaN(endTime) || endTime < new Date();
  const latestBid = bidHistory.length
    ? bidHistory[bidHistory.length - 1].amount
    : artwork.price;

  return (
    <Container className="py-5">
      <Row>
        <Col lg={8}>
          <Card className="mb-4">
            <Card.Img
              variant="top"
              src={`http://localhost:5206${artwork.imageUrl}`}
              alt={artwork.title}
              style={{ height: "400px", objectFit: "cover" }}
            />
            <Card.Body>
              <Card.Title as="h2">{artwork.title}</Card.Title>
              <Card.Subtitle className="mb-3 text-muted">
                by {artwork.artist}
              </Card.Subtitle>
              <Card.Text>{artwork.description}</Card.Text>
              <div className="mb-3">
                {artwork.tags?.map((tag) => (
                  <Badge key={tag} bg="secondary" className="me-2">
                    {tag}
                  </Badge>
                ))}
              </div>
              <small className="text-muted">
                Category: {artwork.category}
                <br />
                Auction Ends:{" "}
                {isNaN(endTime) ? "Unknown" : format(endTime, "PPpp")}
              </small>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>Current Bid: ${latestBid}</Card.Title>
              <Card.Text className="text-muted">
                Initial Price: ${artwork.price}
              </Card.Text>

              {error && (
                <Alert variant="danger" className="mb-3">
                  {error}
                </Alert>
              )}

              {isAuctionEnded ? (
                <Alert variant="warning">Auction has ended.</Alert>
              ) : (
                <Form onSubmit={handleBid}>
                  <Form.Group className="mb-3">
                    <Form.Label>Your Bid</Form.Label>
                    <Form.Control
                      type="number"
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder="Enter bid amount"
                      min={artwork.currentBid + 10}
                    />
                  </Form.Group>
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Place Bid
                    </Button>
                  </div>
                </Form>
              )}
            </Card.Body>
          </Card>

          <Card>
            <Card.Header>Bid History</Card.Header>
            <ListGroup variant="flush">
              {bidHistory.length === 0 ? (
                <ListGroup.Item>No bids yet.</ListGroup.Item>
              ) : (
                bidHistory.map((bid, index) => (
                  <ListGroup.Item key={bid.bidTime + index}>
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <strong>${bid.amount}</strong> by{" "}
                        {bid.userName || bid.bidder || "Unknown"}
                      </div>
                      <small className="text-muted">
                        {format(new Date(bid.bidTime), "Pp")}
                      </small>
                    </div>
                  </ListGroup.Item>
                ))
              )}
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ArtworkDetail;
