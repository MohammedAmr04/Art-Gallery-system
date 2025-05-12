using Microsoft.AspNetCore.SignalR;
using ArtGallery.Application.DTOs;
using System.Threading.Tasks;

namespace ArtGallery.API.Hubs
{
    public class AuctionHub : Hub
    {
        public async Task JoinAuction(int artworkId)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, $"Artwork_{artworkId}");
        }

        public async Task BroadcastBid(BidDto bid)
        {
            await Clients.Group($"Artwork_{bid.ArtworkId}").SendAsync("BidPlaced", bid);
        }
    }
}