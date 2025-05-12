import { useEffect, useState } from "react";
import { Form, Button } from "react-bootstrap";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const EditArtwork = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const history = useNavigate();
  const [artwork, setArtwork] = useState({
    title: "",
    description: "",
    category: "",
    tags: [],
    auctionStartTime: "",
    auctionEndTime: "",
    imageUrl: "",
    price: 0,
  });

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5206/api/Artwork/${id}`
        );
        const data = response.data;
        setArtwork({
          title: data.title,
          description: data.description,
          category: data.category,
          tags: data.tags || [],
          auctionStartTime: data.auctionStartTime,
          auctionEndTime: data.auctionEndTime,
          imageUrl: data.imageUrl,
          price: data.price,
        });
      } catch (error) {
        console.error("Error fetching artwork:", error);
      }
    };

    fetchArtwork();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setArtwork((prevArtwork) => ({
      ...prevArtwork,
      [name]: value,
    }));
  };

  const handleTagsChange = (e) => {
    setArtwork((prevArtwork) => ({
      ...prevArtwork,
      tags: e.target.value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedArtwork = {
        title: artwork.title,
        description: artwork.description,
        category: artwork.category,
        tags: artwork.tags,
        auctionStartTime: new Date(artwork.auctionStartTime).toISOString(),
        auctionEndTime: new Date(artwork.auctionEndTime).toISOString(),
        imageUrl: artwork.imageUrl,
        price: artwork.price,
      };

      const response = await axios.put(
        `http://localhost:5206/api/Artwork/${id}`,
        updatedArtwork,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      console.log("Artwork updated:", response.data);
      history("/artist/dashboard");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Edit Artwork</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Title</Form.Label>
          <Form.Control
            type="text"
            name="title"
            value={artwork.title}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            name="description"
            value={artwork.description}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Category</Form.Label>
          <Form.Control
            type="text"
            name="category"
            value={artwork.category}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Tags (comma separated)</Form.Label>
          <Form.Control
            type="text"
            name="tags"
            value={artwork.tags.join(", ")}
            onChange={handleTagsChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Auction Start Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="auctionStartTime"
            value={artwork.auctionStartTime.slice(0, 16)}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Auction End Time</Form.Label>
          <Form.Control
            type="datetime-local"
            name="auctionEndTime"
            value={artwork.auctionEndTime.slice(0, 16)}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Current Image</Form.Label>
          <br />
          <img
            src={artwork.imageUrl}
            alt="Artwork"
            style={{ width: "300px", borderRadius: "10px" }}
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default EditArtwork;
