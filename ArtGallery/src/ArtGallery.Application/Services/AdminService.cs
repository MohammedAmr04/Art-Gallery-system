using ArtGallery.Application.DTOs;
using ArtGallery.Domain.Entities;
using ArtGallery.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArtGallery.Application.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _db;

        public AdminService(AppDbContext db)
        {
            _db = db;
        }

        public async Task<IEnumerable<UserDto>> GetPendingArtistsAsync()
        {
            return await _db.Users
                .Where(u => u.Role == "Artist" && !u.IsApproved)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    Username = u.Username,
                    Email = u.Email,
                    Role = u.Role
                })
                .ToListAsync();
        }

        public async Task<bool> ApproveArtistAsync(int artistId)
        {
            var user = await _db.Users.FindAsync(artistId);
            if (user == null || user.IsApproved)
                return false;

            user.IsApproved = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectArtistAsync(int artistId)
        {
            var user = await _db.Users.FindAsync(artistId);
            if (user == null || user.IsApproved)
                return false;

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<ArtworkDto>> GetPendingArtworksAsync()
        {
            return await _db.Artworks
                .Where(a => !a.IsApproved)
                .Select(a => ToDto(a))
                .ToListAsync();
        }

        public async Task<bool> ApproveArtworkAsync(int artworkId)
        {
            var art = await _db.Artworks.FindAsync(artworkId);
            if (art == null || art.IsApproved)
                return false;

            art.IsApproved = true;
            await _db.SaveChangesAsync();
            return true;
        }

        public async Task<bool> RejectArtworkAsync(int artworkId)
        {
            var art = await _db.Artworks.FindAsync(artworkId);
            if (art == null || art.IsApproved)
                return false;

            _db.Artworks.Remove(art);
            await _db.SaveChangesAsync();
            return true;
        }

        private static ArtworkDto ToDto(Artwork a) => new()
        {
            Id = a.Id,
            Title = a.Title,
            Description = a.Description,
            Price = a.Price,
            CreatedAt = a.CreatedAt,
            Category = a.Category,
            Tags = a.Tags,
            ImageUrl = a.ImageUrl,
            ArtistId = a.ArtistId,
            AuctionStartTime = a.AuctionStartTime,
            AuctionEndTime = a.AuctionEndTime
        };
    }
}