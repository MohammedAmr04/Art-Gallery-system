using System;

namespace ArtGallery.Domain.Entities
{
    public class Bid
    {
        public int Id { get; set; }
        public int ArtworkId { get; set; }
        public int BuyerId { get; set; }
        public decimal Amount { get; set; }
        public DateTime BidTime { get; set; }
        public DateTime TimeStamp { get; set; }
        public virtual Artwork Artwork { get; set; } = default!;
        public virtual User Buyer { get; set; } = default!;
        public bool IsValidBid(decimal lastBidAmount) => Amount > lastBidAmount;
        public void SetBidTime()
        {
            BidTime = DateTime.UtcNow;
            TimeStamp = DateTime.UtcNow;
        }
    }
}