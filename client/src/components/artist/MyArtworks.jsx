const MyArtworks = () => {
  // Mock data for now
  const artworks = [
    {
      id: 1,
      title: "Sunset",
      description: "A beautiful sunset over the hills.",
      price: "$100",
      image: "https://via.placeholder.com/150",
    },
    {
      id: 2,
      title: "Ocean Breeze",
      description: "Waves crashing onto the shore.",
      price: "$150",
      image: "https://via.placeholder.com/150",
    },
  ];

  return (
    <div className="row">
      {artworks.map((art) => (
        <div key={art.id} className="col-sm-12 col-md-6 col-lg-4 mb-4">
          <div className="card h-100">
            <img src={art.image} className="card-img-top" alt={art.title} />
            <div className="card-body">
              <h5 className="card-title">{art.title}</h5>
              <p className="card-text">{art.description}</p>
              <p className="text-success fw-bold">{art.price}</p>
              <button className="btn btn-primary me-2">Edit</button>
              <button className="btn btn-danger">Delete</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MyArtworks;
