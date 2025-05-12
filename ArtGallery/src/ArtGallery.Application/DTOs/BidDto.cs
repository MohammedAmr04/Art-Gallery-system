using System;

namespace ArtGallery.Application.DTOs
{
    public class BidDto
    {
        public int ArtworkId { get; set; }
        public int BuyerId { get; set; }
        public decimal Amount { get; set; }
        public DateTime BidTime { get; set; }
        public DateTime TimeStamp { get; set; }
        public string BuyerName { get; set; } = string.Empty; // ← جديد

    }
}