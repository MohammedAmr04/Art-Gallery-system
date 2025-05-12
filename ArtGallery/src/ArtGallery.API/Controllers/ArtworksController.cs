using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ArtGallery.API.Hubs;
using ArtGallery.Application.DTOs;
using ArtGallery.Application.Services;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Security.Claims;

namespace ArtGallery.Api.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArtworkController : ControllerBase
    {
        private readonly IArtworkService _artworkService;
        private readonly IAuctionService _auctionService;
        private readonly IHubContext<AuctionHub> _auctionHubContext;

        public ArtworkController(IArtworkService artworkService, IAuctionService auctionService, IHubContext<AuctionHub> bidHubContext)
        {
            _artworkService = artworkService;
            _auctionService = auctionService;
            _auctionHubContext = bidHubContext;
        }

        [HttpPost]
        [Authorize(Roles = "Artist")]
        public async Task<ActionResult<ArtworkDto>> Create([FromForm] CreateArtworkDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue("userId"));
                var artwork = await _artworkService.CreateAsync(dto, userId);
                return CreatedAtAction(nameof(GetById), new { id = artwork.Id }, artwork);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ArtworkDto>>> GetArtworks(
    [FromQuery] string? category = null,
    [FromQuery] string? tag = null,
    [FromQuery] string? sortBy = null,
    [FromQuery] string? sortDirection = null,
    [FromQuery] int pageNumber = 1,
    [FromQuery] int pageSize = 10,
    [FromQuery] string? artistName = null,
    [FromQuery] string? tags = null)  // إضافة الوسيط الجديد
        {
            try
            {
                var artworks = await _artworkService.GetAllAsync(
                    category ?? string.Empty,
                    tag ?? string.Empty,
                    sortBy ?? "createdat",
                    sortDirection ?? "desc",
                    pageNumber,
                    pageSize,
                    artistName ?? string.Empty,
                    tags ?? string.Empty);

                return Ok(artworks);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ArtworkDto>> GetById(int id)
        {
            var artwork = await _artworkService.GetByIdAsync(id);
            if (artwork == null) return NotFound();
            return Ok(artwork);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Artist")]
        public async Task<ActionResult> Update(int id, [FromBody] ArtworkDto dto)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue("userId"));
                dto.ArtistId = userId;
                var success = await _artworkService.UpdateAsync(id, dto);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "Artist")]
        public async Task<ActionResult> Delete(int id)
        {
            try
            {
                var userId = int.Parse(User.FindFirstValue("userId"));
                var artwork = await _artworkService.GetByIdAsync(id);
                if (artwork == null || artwork.ArtistId != userId) return NotFound();
                var success = await _artworkService.DeleteAsync(id);
                if (!success) return NotFound();
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("{artworkId}/bid")]
        [Authorize(Roles = "Buyer")]
        public async Task<ActionResult> PlaceBid(int artworkId, [FromBody] BidDto bidDto)
        {
            try
            {
                bidDto.ArtworkId = artworkId;
                bidDto.BuyerId = int.Parse(User.FindFirstValue("userId"));
                var result = await _auctionService.PlaceBidAsync(bidDto);

                await _auctionHubContext.Clients.Group($"Artwork_{artworkId}").SendAsync("ReceiveBidUpdate", result);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{artworkId}/bids")]
        [Authorize]
        public async Task<ActionResult<IEnumerable<BidDto>>> GetBidHistory(int artworkId)
        {
            try
            {
                var bids = await _artworkService.GetBidHistoryAsync(artworkId);
                return Ok(bids);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPut("{artworkId}/extend-auction")]
        [Authorize(Roles = "Artist")]
        public async Task<ActionResult> ExtendAuctionTime(int artworkId, [FromBody] DateTime newEndTime)
        {
            try
            {
                var artistId = int.Parse(User.FindFirstValue("userId"));
                var success = await _artworkService.ExtendAuctionTimeAsync(artworkId, newEndTime, artistId);
                if (!success) return BadRequest("Failed to extend auction time.");

                await _auctionHubContext.Clients.Group($"Artwork_{artworkId}").SendAsync("ReceiveAuctionExtension", artworkId, newEndTime);
                return NoContent();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpGet("{artworkId}/winner")]
        [Authorize(Roles = "Artist")]
        public async Task<ActionResult<BidDto>> GetWinner(int artworkId)
        {
            try
            {
                var artistId = int.Parse(User.FindFirstValue("userId"));
                var winner = await _artworkService.GetWinnerAsync(artworkId, artistId);
                if (winner == null) return NotFound();
                return Ok(winner);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}