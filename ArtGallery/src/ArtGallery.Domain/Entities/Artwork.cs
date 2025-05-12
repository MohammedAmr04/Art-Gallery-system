using System;
using System.Collections.Generic;

namespace ArtGallery.Domain.Entities
{
    public class Artwork
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public decimal Price { get; set; }
        public DateTime CreatedAt { get; set; }
        public string Category { get; set; }
        public List<string>? Tags { get; set; }
        public string? ImageUrl { get; set; }
        public int ArtistId { get; set; }
        public DateTime AuctionStartTime { get; set; }
        public DateTime AuctionEndTime { get; set; }
        public ICollection<Bid> Bids { get; set; }
        public User Artist { get; set; }
        public bool IsApproved { get; set; } = false;

        public void SetAuctionTimes(DateTime start, DateTime end)
        {
            if (start >= end)
                throw new InvalidOperationException("Auction start time must be before end time.");

            AuctionStartTime = start;
            AuctionEndTime = end;
        }
    }
}