using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using ArtGallery.API.Hubs;
using ArtGallery.Application.DTOs;
using ArtGallery.Application.Services;
using System;
using System.Threading.Tasks;
using System.Security.Claims;

namespace ArtGallery.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class AuctionController : ControllerBase
    {
        private readonly IAuctionService _auctionService;
        private readonly IHubContext<AuctionHub> _hub;

        public AuctionController(IAuctionService auctionService, IHubContext<AuctionHub> hub)
        {
            _auctionService = auctionService;
            _hub = hub;
        }

        [HttpPost("place-bid")]
        [Authorize(Roles = "Buyer")]
        public async Task<IActionResult> PlaceBid([FromBody] BidDto bidDto)
        {
            if (bidDto == null)
                return BadRequest(new { message = "Bid data is null." });

            if (bidDto.Amount <= 0)
                return BadRequest(new { message = "Bid amount must be greater than zero." });

            try
            {
                bidDto.BuyerId = int.Parse(User.FindFirstValue("userId"));
                var result = await _auctionService.PlaceBidAsync(bidDto);
                await _hub.Clients.Group($"Artwork_{result.ArtworkId}").SendAsync("BidPlaced", result);
                return CreatedAtAction(nameof(GetBidsForArtwork), new { artworkId = result.ArtworkId }, result);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("bids/{artworkId}")]
        public async Task<IActionResult> GetBidsForArtwork(int artworkId)
        {
            try
            {
                var bids = await _auctionService.GetBidsForArtworkAsync(artworkId);
                return Ok(bids);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }

        [HttpGet("public/bids/{artworkId}")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPublicBidsForArtwork(int artworkId)
        {
            try
            {
                var bids = await _auctionService.GetBidsForArtworkAsync(artworkId);
                return Ok(bids);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "An unexpected error occurred.", details = ex.Message });
            }
        }
    }
}