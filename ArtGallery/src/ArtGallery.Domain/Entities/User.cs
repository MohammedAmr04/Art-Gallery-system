using System.Collections.Generic;

namespace ArtGallery.Domain.Entities
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = default!;
        public string PasswordHash { get; set; } = default!;
        public string Email { get; set; } = default!;
        public string Role { get; set; } = default!;
        public ICollection<Artwork> Artworks { get; set; } = new List<Artwork>();
        public ICollection<Bid> Bids { get; set; } = new List<Bid>();
        public bool IsArtist => Role == "Artist";
        public bool IsAdmin => Role == "Admin";
        public bool IsBuyer => Role == "Buyer";
        public bool IsApproved { get; set; } = false;
    }
}