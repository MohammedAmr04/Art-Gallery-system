using ArtGallery.Application.DTOs;
using ArtGallery.Domain.Entities;
using ArtGallery.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ArtGallery.Application.Services
{
    public class ArtworkService : IArtworkService
    {
        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _env;


        public ArtworkService(AppDbContext context, IWebHostEnvironment env)
        {
            _context = context;
            _env = env;

        }

        public async Task<ArtworkDto> CreateAsync(CreateArtworkDto dto, int userId)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == userId))
                throw new KeyNotFoundException($"User with ID {userId} not found.");

            string? imageUrl = null;
            if (dto.Image != null && dto.Image.Length > 0)
            {
                var fileName = Guid.NewGuid() + Path.GetExtension(dto.Image.FileName);
                var folderPath = Path.Combine(_env.WebRootPath, "uploads");

                if (!Directory.Exists(folderPath))
                    Directory.CreateDirectory(folderPath);

                var filePath = Path.Combine(folderPath, fileName);

                using var stream = new FileStream(filePath, FileMode.Create);
                await dto.Image.CopyToAsync(stream);

                imageUrl = "/uploads/" + fileName;
            }

            var artwork = new Artwork
            {
                Title = dto.Title,
                Description = dto.Description,
                Price = dto.Price,
                CreatedAt = DateTime.UtcNow,
                Category = dto.Category,
                ImageUrl = imageUrl,
                Tags = dto.Tags,
                ArtistId = userId,
                AuctionStartTime = dto.AuctionStartTime,
                AuctionEndTime = dto.AuctionEndTime
            };

            _context.Artworks.Add(artwork);
            await _context.SaveChangesAsync();
            return ToDto(artwork);
        }

        public async Task<PagedResult<ArtworkDto>> GetAllAsync(
            string category,
            string tag,
            string sortBy,
            string sortDirection,
            int pageNumber,
            int pageSize,
            string artistName,
            string tags)
        {
            var query = _context.Artworks.Where(a => a.IsApproved).AsQueryable();

            // Apply filters
            if (!string.IsNullOrEmpty(category))
                query = query.Where(a => a.Category == category);

            if (!string.IsNullOrEmpty(tag))
                query = query.Where(a => a.Tags.Contains(tag));

            if (!string.IsNullOrEmpty(artistName))
            {
                if (int.TryParse(artistName, out int artistId))
                    query = query.Where(a => a.ArtistId == artistId);
                else
                    query = query.Where(a => _context.Users.Any(u => u.Id == a.ArtistId && u.Username.Contains(artistName)));
            }

            if (!string.IsNullOrEmpty(tags))
            {
                var tagsList = tags.Split(',').ToList();
                query = query.Where(a => a.Tags.Any(t => tagsList.Contains(t)));
            }

            // Apply sorting
            var sortByLower = string.IsNullOrEmpty(sortBy) ? null : sortBy.ToLower();
            var sortDirectionLower = string.IsNullOrEmpty(sortDirection) ? "desc" : sortDirection.ToLower();

            query = (sortByLower, sortDirectionLower) switch
            {
                ("price", "asc") => query.OrderBy(a => a.Price),
                ("price", "desc") => query.OrderByDescending(a => a.Price),
                ("createdat", "asc") => query.OrderBy(a => a.CreatedAt),
                ("createdat", "desc") => query.OrderByDescending(a => a.CreatedAt),
                _ => query.OrderByDescending(a => a.CreatedAt),
            };

            // Pagination
            var totalCount = await query.CountAsync();
            var items = await query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .Select(a => ToDto(a))
                .ToListAsync();

            return new PagedResult<ArtworkDto>
            {
                PageNumber = pageNumber,
                PageSize = pageSize,
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task<PagedResult<ArtworkDto>> FilterAndSortAsync(ArtworkFilterDto filter)
        {
            var query = _context.Artworks.Where(a => a.IsApproved).AsQueryable();

            if (!string.IsNullOrEmpty(filter.Category))
                query = query.Where(a => a.Category == filter.Category);

            if (filter.MinPrice.HasValue)
                query = query.Where(a => a.Price >= filter.MinPrice);

            if (filter.MaxPrice.HasValue)
                query = query.Where(a => a.Price <= filter.MaxPrice);

            if (!string.IsNullOrEmpty(filter.Tags))
                query = query.Where(a => a.Tags.Contains(filter.Tags));

            query = filter.SortBy switch
            {
                "price" when filter.SortDirection == "asc" => query.OrderBy(a => a.Price),
                "price" when filter.SortDirection == "desc" => query.OrderByDescending(a => a.Price),
                _ => query.OrderByDescending(a => a.CreatedAt),
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((filter.PageNumber - 1) * filter.PageSize)
                .Take(filter.PageSize)
                .Select(a => ToDto(a))
                .ToListAsync();

            return new PagedResult<ArtworkDto>
            {
                PageNumber = filter.PageNumber,
                PageSize = filter.PageSize,
                TotalCount = totalCount,
                Items = items
            };
        }

        public async Task<ArtworkDto?> GetByIdAsync(int id)
        {
            var artwork = await _context.Artworks.Where(a => a.IsApproved).FirstOrDefaultAsync(a => a.Id == id);
            if (artwork == null) return null;
            return ToDto(artwork);
        }

        public async Task<bool> UpdateAsync(int id, ArtworkDto dto)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null || artwork.ArtistId != dto.ArtistId)
                return false;

            artwork.Title = dto.Title;
            artwork.Description = dto.Description;
            artwork.Price = dto.Price;
            artwork.Category = dto.Category;
            artwork.Tags = dto.Tags;
            artwork.ImageUrl = dto.ImageUrl;

            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var artwork = await _context.Artworks.FindAsync(id);
            if (artwork == null) return false;

            _context.Artworks.Remove(artwork);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<IEnumerable<BidDto>> GetBidHistoryAsync(int artworkId)
        {
            return await _context.Bids
                .Where(b => b.ArtworkId == artworkId)
                .OrderBy(b => b.BidTime)
                .Select(b => new BidDto
                {
                    ArtworkId = b.ArtworkId,
                    BuyerId = b.BuyerId,
                    Amount = b.Amount,
                    BidTime = b.BidTime
                })
                .ToListAsync();
        }

        //public async Task<BidDto?> GetWinnerAsync(int artworkId, int artistId)
        //{
        //    var artwork = await _context.Artworks.FindAsync(artworkId);
        //    if (artwork == null || artwork.ArtistId != artistId)
        //        return null;

        //    if (DateTime.UtcNow <= artwork.AuctionEndTime)
        //        return null;

        //    var lastBid = await _context.Bids
        //        .Where(b => b.ArtworkId == artworkId)
        //        .OrderByDescending(b => b.BidTime)
        //        .FirstOrDefaultAsync();

        //    if (lastBid == null) return null;

        //    return new BidDto
        //    {
        //        ArtworkId = lastBid.ArtworkId,
        //        BuyerId = lastBid.BuyerId,
        //        Amount = lastBid.Amount,
        //        BidTime = lastBid.BidTime
        //    };
        //}
        public async Task<BidDto?> GetWinnerAsync(int artworkId, int artistId)
        {
            var lastBid = await _context.Bids
                        .Include(b => b.Buyer)

                .Where(b => b.ArtworkId == artworkId)
                .OrderByDescending(b => b.BidTime)
                .FirstOrDefaultAsync();

            if (lastBid == null) return null;

            return new BidDto
            {
                ArtworkId = lastBid.ArtworkId,
                BuyerId = lastBid.BuyerId,
                BuyerName = lastBid.Buyer.Username, // ← تأكد من اسم الحقل في كلاس User

                Amount = lastBid.Amount,
                BidTime = lastBid.BidTime
            };
        }

        public async Task<bool> ExtendAuctionTimeAsync(int artworkId, DateTime newEndTime, int artistId)
        {
            var artwork = await _context.Artworks.FindAsync(artworkId);
            if (artwork == null || artwork.ArtistId != artistId || newEndTime <= DateTime.UtcNow)
                return false;

            artwork.AuctionEndTime = newEndTime;
            await _context.SaveChangesAsync();
            return true;
        }

        private static ArtworkDto ToDto(Artwork artwork) => new()
        {
            Id = artwork.Id,
            Title = artwork.Title,
            Description = artwork.Description,
            Price = artwork.Price,
            CreatedAt = artwork.CreatedAt,
            Category = artwork.Category,
            ImageUrl = artwork.ImageUrl,
            Tags = artwork.Tags,
            ArtistId = artwork.ArtistId,
            AuctionStartTime = artwork.AuctionStartTime,
            AuctionEndTime = artwork.AuctionEndTime
        };
    }
}