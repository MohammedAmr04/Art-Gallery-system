const AuctionResults = () => {
  const results = [
    { id: 1, title: "Sunset", winner: "buyer1", finalBid: "$160" },
    { id: 2, title: "Ocean Breeze", winner: "buyer2", finalBid: "$210" },
  ];

  return (
    <div className="table-responsive">
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Artwork</th>
            <th>Winner</th>
            <th>Final Bid</th>
          </tr>
        </thead>
        <tbody>
          {results.map((res) => (
            <tr key={res.id}>
              <td>{res.title}</td>
              <td>{res.winner}</td>
              <td>{res.finalBid}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AuctionResults;
