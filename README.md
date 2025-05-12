# Art Gallery System

A full-stack web application for managing an online art gallery, featuring a .NET backend and a React frontend.

## Tech Stack

### Backend

- **Framework**: .NET (C#)
- **Architecture**: Clean Architecture (API, Application, Domain, Infrastructure)
- **Authentication**: JWT-based authentication
- **Real-time Communication**: SignalR for live updates (e.g., auction bids)
- **Database**: Entity Framework Core (SQL Server)
- **API**: RESTful endpoints for artwork, auction, user, and admin management

### Frontend

- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router DOM
- **UI Library**: Bootstrap 5
- **Form Handling**: Formik & Yup
- **HTTP Client**: Axios
- **Real-time Updates**: SignalR
- **Authentication**: JWT

## Features

### Backend

- **Artwork Management**: CRUD operations for artworks, including image uploads and filtering by category, price, and creation date.
- **Auction System**: Real-time bidding with SignalR, bid history, and auction extension.
- **User Management**: Registration, login, and role-based access control (Admin, Artist, Buyer).
- **Admin Dashboard**: Approve/reject artists and artworks.

### Frontend

- **User Authentication**: Secure login and registration.
- **Artist Dashboard**: Manage artworks and view bid history.
- **Admin Dashboard**: Approve/reject artists and artworks.
- **Artwork Showcase**: Dynamic display of artworks with filtering and sorting.
- **Real-time Updates**: Live updates for auction bids using SignalR.

## Project Structure

### Backend (`ArtGallery/`)

- **ArtGallery.API**: RESTful API endpoints and SignalR hubs.
- **ArtGallery.Application**: Business logic and DTOs.
- **ArtGallery.Domain**: Domain models and interfaces.
- **ArtGallery.Infrastructure**: Data access and external services.

### Frontend (`client/`)

- **src/**: Source code
  - **assets/**: Static assets
  - **components/**: Reusable React components
  - **context/**: React context providers
  - **pages/**: Page components (Home, Login, ArtistDashboard, AdminDashboard, etc.)
  - **App.jsx**: Main application component
  - **main.jsx**: Application entry point

## Setup Instructions

### Backend

1. Clone the repository:
   ```bash
   git clone https://github.com/MohammedAmr04/Art-Gallery-System.git
   cd ArtGallery
   ```
2. Restore packages:
   ```bash
   dotnet restore
   ```
3. Update the database:
   ```bash
   dotnet ef database update
   ```
4. Run the application:
   ```bash
   dotnet run
   ```

### Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## API Endpoints

### Artwork

- `GET /api/Artwork`: Get all artworks (with filtering and sorting)
- `GET /api/Artwork/{id}`: Get artwork by ID
- `POST /api/Artwork`: Create a new artwork (Artist role required)
- `PUT /api/Artwork/{id}`: Update artwork (Artist role required)
- `DELETE /api/Artwork/{id}`: Delete artwork (Artist role required)

### Auction

- `POST /api/Auction/place-bid`: Place a bid (Buyer role required)
- `GET /api/Auction/bids/{artworkId}`: Get bid history for an artwork
- `GET /api/Auction/public/bids/{artworkId}`: Get public bid history

### Authentication

- `POST /api/Auth/register`: Register a new user
- `POST /api/Auth/login`: Login and get JWT token

### Admin

- `GET /api/Admin/artists/pending`: Get pending artists (Admin role required)
- `POST /api/Admin/artists/{artistId}/approve`: Approve an artist (Admin role required)
- `POST /api/Admin/artists/{artistId}/reject`: Reject an artist (Admin role required)
- `GET /api/Admin/artworks/pending`: Get pending artworks (Admin role required)
- `POST /api/Admin/artworks/{artworkId}/approve`: Approve an artwork (Admin role required)
- `POST /api/Admin/artworks/{artworkId}/reject`: Reject an artwork (Admin role required)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
