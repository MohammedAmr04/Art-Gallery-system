// AddArtwork.js
import { useState } from "react";

const AddArtwork = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    category: "Portrait",
    tags: "",
    image: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("New Artwork:", form);
  };

  return (
    <form onSubmit={handleSubmit} className="row g-3">
      <div className="col-md-6">
        <label className="form-label">Title</label>
        <input
          type="text"
          className="form-control"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-md-6">
        <label className="form-label">Initial Price ($)</label>
        <input
          type="number"
          className="form-control"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="col-12">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          name="description"
          rows="3"
          value={form.description}
          onChange={handleChange}
          required
        ></textarea>
      </div>

      <div className="col-md-6">
        <label className="form-label">Category</label>
        <select
          className="form-select"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option value="Portrait">Portrait</option>
          <option value="Landscape">Landscape</option>
        </select>
      </div>

      <div className="col-md-6">
        <label className="form-label">Tags</label>
        <input
          type="text"
          className="form-control"
          name="tags"
          value={form.tags}
          onChange={handleChange}
          placeholder="e.g. modern, oil painting"
        />
      </div>

      <div className="col-md-12">
        <label className="form-label">Image URL</label>
        <input
          type="text"
          className="form-control"
          name="image"
          value={form.image}
          onChange={handleChange}
        />
      </div>

      <div className="col-12">
        <button type="submit" className="btn btn-success">
          Submit Artwork
        </button>
      </div>
    </form>
  );
};

export default AddArtwork;
