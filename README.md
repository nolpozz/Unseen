# Unseen: AI-Powered Art Experience Platform

A modern web application for creating interactive art experiences with QR codes, AI-generated content, and a marketplace for AI art. Built with React, Express, and AI integration.

## Tech Stack
- **Frontend**: React + Vite
- **Backend**: Node.js + Express
- **Styling**: CSS with glassmorphism design
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **AI Integration**: Mock AI services (OpenAI/DALL-E ready)

## Project Structure
```
/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app component
│   │   └── index.css      # Global styles
│   ├── package.json
│   └── vite.config.js
├── server/                # Express backend
│   ├── index.js          # Main server file
│   └── package.json
├── package.json          # Root package.json
└── README.md
```

## Features

### 🎨 **Art Experience Management**
- **Event Creation**: Create events with multiple art pieces
- **Individual Art Pieces**: Each piece has its own QR code and descriptions
- **QR Code System**: Scan codes to access specific art pieces

### 🤖 **AI Content Generation**
- **Art Descriptions**: Users describe individual art pieces
- **AI Summary**: AI-generated descriptions of art pieces
- **AI Poetry**: Creative poems inspired by art descriptions
- **AI Artwork**: Visual representations generated from descriptions

### 🛒 **Marketplace**
- **AI Art Listings**: Browse AI-generated content
- **Pricing**: Set prices for AI-generated artwork
- **Artist Attribution**: Track original artists and events

### 📱 **User Experience**
- **Responsive Design**: Works on desktop and mobile
- **Dark Theme**: Modern glassmorphism UI
- **Real-time Updates**: Live description collection

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Quick Demo
**Single Command Setup:**
```bash
npm run demo
```

**Or use the platform-specific scripts:**
- **Windows**: Double-click `demo.bat` or run `demo.bat`
- **Mac/Linux**: Run `./demo.sh` or `bash demo.sh`

This will automatically:
1. Install all dependencies
2. Start both servers
3. Open your browser to http://localhost:3000
4. Show interactive demo instructions

### Manual Installation
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Unseen
   ```

2. **Install dependencies**
   ```bash
   npm run install:all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:3002

## Demo Walkthrough

### 🎪 Interactive Demo Flow
1. **Start the demo**: Run `npm run demo`
2. **Browse Events**: Click "Events" → View "Corporate Art Exhibition"
3. **Explore Art Pieces**: Click "View Details" on "Abstract Corporate"
4. **Add Descriptions**: Write something like "This piece feels dynamic and energetic"
5. **Generate AI Content**: Click "Generate AI Content" to create AI summary, poem, and art
6. **Visit Marketplace**: See the generated content listed for purchase

### 📱 QR Code Demo
- Click "Scan Event QR Code" on the Events page
- Use the mock QR scanner to simulate real-world usage
- Experience how attendees would interact with art pieces

## Usage

### For Event Organizers
1. **Create Events**: Add events with multiple art pieces
2. **Generate QR Codes**: Each art piece gets its own QR code
3. **Collect Descriptions**: Attendees scan QR codes to describe pieces
4. **Generate AI Content**: Create AI summaries, poems, and artwork

### For Event Attendees
1. **Scan QR Codes**: Use QR codes next to art pieces
2. **Add Descriptions**: Share thoughts about specific pieces
3. **View AI Content**: See AI-generated content from all descriptions

### For Art Collectors
1. **Browse Marketplace**: View AI-generated artwork
2. **Purchase Art**: Buy AI-generated pieces with descriptions
3. **Support Artists**: Revenue goes to original artists

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get specific event
- `POST /api/events` - Create new event

### Art Pieces
- `POST /api/events/:id/art-pieces` - Add art piece to event
- `POST /api/art-pieces/:artPieceId/descriptions` - Add description to art piece
- `POST /api/art-pieces/:artPieceId/generate-ai-content` - Generate AI content

### Artists
- `GET /api/artists` - Get all artists
- `GET /api/artists/:id` - Get specific artist

### Marketplace
- `GET /api/marketplace` - Get all marketplace listings
- `GET /api/marketplace/:id` - Get specific listing

## Development

### Available Scripts
- `npm run demo` - **One-command demo setup** (recommended)
- `npm start` - Start production servers
- `npm run dev` - Start development servers with hot reload
- `npm run server:dev` - Start backend development server
- `npm run client:dev` - Start frontend development server
- `npm run setup` - Install all dependencies
- `npm run clean` - Clean node_modules and build files
- `npm run reset` - Clean and reinstall everything

### Adding New Features
1. **Backend**: Add routes to `server/index.js`
2. **Frontend**: Create components in `client/src/`
3. **Styling**: Use existing CSS classes or add to `index.css`

## Future Enhancements
- Real AI integration (OpenAI, DALL-E)
- User authentication and profiles
- Payment processing
- Real-time messaging
- Advanced analytics
- Mobile app version

## License
MIT License
