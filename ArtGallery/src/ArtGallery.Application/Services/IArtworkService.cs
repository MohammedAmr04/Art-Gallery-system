using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using ArtGallery.Application.DTOs;

namespace ArtGallery.Application.Services
{
    public interface IArtworkService
    {
        Task<ArtworkDto> CreateAsync(CreateArtworkDto dto, int userId);
        Task<PagedResult<ArtworkDto>> GetAllAsync(
        string? category,
        string? tag,
        string sortBy,
        string sortDirection,
        int pageNumber,
        int pageSize,
        string? artistName,
        string? tags);
        Task<PagedResult<ArtworkDto>> FilterAndSortAsync(ArtworkFilterDto filter);
        Task<ArtworkDto?> GetByIdAsync(int id);
        Task<bool> UpdateAsync(int id, ArtworkDto dto);
        Task<bool> DeleteAsync(int id);
        Task<IEnumerable<BidDto>> GetBidHistoryAsync(int artworkId);
        Task<bool> ExtendAuctionTimeAsync(int artworkId, DateTime newEndTime, int artistId);
        Task<BidDto?> GetWinnerAsync(int artworkId, int artistId);
    }
}