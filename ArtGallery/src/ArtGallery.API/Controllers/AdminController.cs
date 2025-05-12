using System.Collections.Generic;
using System.Threading.Tasks;
using ArtGallery.Application.DTOs;
using ArtGallery.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ArtGallery.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize(Roles = "Admin")]
    public class AdminController : ControllerBase
    {
        private readonly IAdminService _adminService;

        public AdminController(IAdminService adminService)
        {
            _adminService = adminService;
        }

        [HttpGet("artists/pending")]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetPendingArtists()
        {
            var pending = await _adminService.GetPendingArtistsAsync();
            return Ok(pending);
        }

        [HttpPost("artists/{artistId}/approve")]
        public async Task<IActionResult> ApproveArtist(int artistId)
        {
            var success = await _adminService.ApproveArtistAsync(artistId);
            if (!success) return NotFound(new { message = $"Artist {artistId} not found or already processed." });
            return NoContent();
        }

        [HttpPost("artists/{artistId}/reject")]
        public async Task<IActionResult> RejectArtist(int artistId)
        {
            var success = await _adminService.RejectArtistAsync(artistId);
            if (!success) return NotFound(new { message = $"Artist {artistId} not found or already processed." });
            return NoContent();
        }

        [HttpGet("artworks/pending")]
        public async Task<ActionResult<IEnumerable<ArtworkDto>>> GetPendingArtworks()
        {
            var pending = await _adminService.GetPendingArtworksAsync();
            return Ok(pending);
        }

        [HttpPost("artworks/{artworkId}/approve")]
        public async Task<IActionResult> ApproveArtwork(int artworkId)
        {
            var success = await _adminService.ApproveArtworkAsync(artworkId);
            if (!success) return NotFound(new { message = $"Artwork {artworkId} not found or already processed." });
            return NoContent();
        }

        [HttpPost("artworks/{artworkId}/reject")]
        public async Task<IActionResult> RejectArtwork(int artworkId)
        {
            var success = await _adminService.RejectArtworkAsync(artworkId);
            if (!success) return NotFound(new { message = $"Artwork {artworkId} not found or already processed." });
            return NoContent();
        }
    }
}