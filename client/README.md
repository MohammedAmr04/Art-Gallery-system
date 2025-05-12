# Art Gallery Application

A modern web application for managing and showcasing artwork, built with React and Vite.

## Repository Description

🎨 **Art Gallery Platform** - A full-featured web application that connects artists with art enthusiasts. This platform provides a seamless experience for artists to showcase their work and for users to discover and appreciate art. Built with modern web technologies, it offers real-time updates, secure authentication, and role-based access control.

Key Highlights:

- 🖼️ Dynamic artwork showcase and management
- 👥 Multi-role user system (Artists, Admins, Viewers)
- 🔒 Secure authentication with JWT
- ⚡ Real-time updates using SignalR
- 📱 Responsive design for all devices
- 🎯 Intuitive artist and admin dashboards

## Features

- User authentication and authorization
- Artist dashboard for managing artwork
- Admin dashboard for system management
- Artwork detail pages
- Responsive design using Bootstrap
- Real-time updates using SignalR

## Tech Stack

- React 18
- Vite
- React Router DOM
- Bootstrap 5
- Formik & Yup for form handling
- Axios for API requests
- SignalR for real-time communication
- JWT for authentication

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository

```bash
git clone [repository-url]
```

2. Install dependencies

```bash
npm install
```

3. Start the development server

```bash
npm run dev
```

4. Build for production

```bash
npm run build
```

## Project Structure

```
src/
├── assets/         # Static assets
├── components/     # Reusable components
├── context/        # React context providers
├── pages/          # Page components
├── App.jsx         # Main application component
└── main.jsx        # Application entry point
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Authentication

The application supports multiple user roles:

- Regular users
- Artists
- Administrators

Protected routes are implemented for artist and admin dashboards.

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License.
