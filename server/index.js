const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
}

// Mock data for artists
const mockArtists = [
  {
    id: '1',
    name: 'Sarah Chen',
    specialty: 'Digital Art & Illustration',
    rating: 4.8,
    hourlyRate: 75,
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=400',
    description: 'Award-winning digital artist specializing in character design and concept art.',
    portfolio: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
    ]
  },
  {
    id: '2',
    name: 'Marcus Rodriguez',
    specialty: 'Live Performance Art',
    rating: 4.9,
    hourlyRate: 120,
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
    description: 'Dynamic performance artist creating immersive experiences for events.',
    portfolio: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
    ]
  },
  {
    id: '3',
    name: 'Emma Thompson',
    specialty: 'Photography & Visual Storytelling',
    rating: 4.7,
    hourlyRate: 90,
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400',
    description: 'Professional photographer capturing moments that tell compelling stories.',
    portfolio: [
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300',
      'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=300'
    ]
  }
];

// Mock events data with art pieces that have their own descriptions
const mockEvents = [
  {
    id: '1',
    title: 'Corporate Art Exhibition',
    date: '2024-02-15',
    location: 'Downtown Gallery',
    status: 'upcoming',
    artistId: '1',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-1-corporate-art',
    artPieces: [
      {
        id: '1',
        title: 'Digital Harmony',
        description: 'A modern digital composition exploring corporate aesthetics',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        artistId: '1',
        price: 2500,
        aiGenerated: false,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=artpiece-1-digital-harmony',
        descriptions: [
          { id: '1', text: 'The geometric patterns create a sense of order and structure', timestamp: '2024-02-15T10:30:00Z' },
          { id: '2', text: 'The color palette feels very corporate but with a modern twist', timestamp: '2024-02-15T11:15:00Z' }
        ],
        aiSummary: null,
        aiPoem: null,
        aiGeneratedArt: null,
        aiModel: null
      },
      {
        id: '2',
        title: 'Abstract Corporate',
        description: 'Abstract representation of corporate culture and dynamics',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        artistId: '1',
        price: 1800,
        aiGenerated: false,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=artpiece-2-abstract-corporate',
        descriptions: [
          { id: '3', text: 'The flowing lines represent the dynamic nature of business', timestamp: '2024-02-15T12:00:00Z' },
          { id: '4', text: 'I see tension and harmony coexisting in this piece', timestamp: '2024-02-15T12:45:00Z' },
          { id: '5', text: 'The abstract forms suggest collaboration and teamwork', timestamp: '2024-02-15T13:30:00Z' }
        ],
        aiSummary: 'A dynamic abstract composition that captures the tension and harmony of corporate culture through flowing lines and geometric forms.',
        aiPoem: 'Lines of business flow and weave\nIn abstract dance of corporate dreams\nTension and harmony both achieve\nCollaboration in visual streams',
        aiGeneratedArt: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        aiModel: 'DALL-E 3 + GPT-4'
      }
    ]
  },
  {
    id: '2',
    title: 'Wedding Photography',
    date: '2024-01-20',
    location: 'Rose Garden Venue',
    status: 'completed',
    artistId: '3',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-2-wedding-photo',
    artPieces: [
      {
        id: '3',
        title: 'Sunset Ceremony',
        description: 'AI-generated artwork capturing the magical sunset ceremony',
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        artistId: '3',
        price: 1200,
        aiGenerated: true,
        qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=artpiece-3-sunset-ceremony',
        descriptions: [
          { id: '6', text: 'The golden light makes everything feel magical and romantic', timestamp: '2024-01-20T18:30:00Z' },
          { id: '7', text: 'I can feel the emotion and love in this moment', timestamp: '2024-01-20T19:15:00Z' },
          { id: '8', text: 'The sunset colors create such a perfect backdrop', timestamp: '2024-01-20T20:00:00Z' }
        ],
        aiSummary: 'A breathtaking sunset ceremony captured in golden light, symbolizing the beginning of a beautiful journey together.',
        aiPoem: 'Golden light upon the altar\nTwo hearts becoming one\nSunset paints the sky with promise\nOf a love that\'s just begun',
        aiGeneratedArt: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
        aiModel: 'DALL-E 3 + GPT-4'
      }
    ]
  }
];

// Mock marketplace listings (generated from art piece descriptions)
const mockMarketplace = [
  {
    id: '1',
    title: 'Abstract Corporate',
    description: 'Abstract representation of corporate culture and dynamics',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    artistId: '1',
    artistName: 'Sarah Chen',
    eventId: '1',
    eventTitle: 'Corporate Art Exhibition',
    artPieceId: '2',
    price: 1800,
    aiGenerated: true,
    aiSummary: 'A dynamic abstract composition that captures the tension and harmony of corporate culture through flowing lines and geometric forms.',
    aiPoem: 'Lines of business flow and weave\nIn abstract dance of corporate dreams\nTension and harmony both achieve\nCollaboration in visual streams',
    aiGeneratedArt: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    aiModel: 'DALL-E 3 + GPT-4',
    createdAt: '2024-02-15T14:00:00Z'
  },
  {
    id: '2',
    title: 'Sunset Ceremony',
    description: 'AI-generated artwork capturing the magical sunset ceremony',
    imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    artistId: '3',
    artistName: 'Emma Thompson',
    eventId: '2',
    eventTitle: 'Wedding Photography',
    artPieceId: '3',
    price: 1200,
    aiGenerated: true,
    aiSummary: 'A breathtaking sunset ceremony captured in golden light, symbolizing the beginning of a beautiful journey together.',
    aiPoem: 'Golden light upon the altar\nTwo hearts becoming one\nSunset paints the sky with promise\nOf a love that\'s just begun',
    aiGeneratedArt: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    aiModel: 'DALL-E 3 + GPT-4',
    createdAt: '2024-01-20T21:00:00Z'
  }
];

// API Routes
app.get('/api/artists', (req, res) => {
  res.json(mockArtists);
});

app.get('/api/artists/:id', (req, res) => {
  const artist = mockArtists.find(a => a.id === req.params.id);
  if (artist) {
    res.json(artist);
  } else {
    res.status(404).json({ error: 'Artist not found' });
  }
});

app.get('/api/events', (req, res) => {
  res.json(mockEvents);
});

app.get('/api/events/:id', (req, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (event) {
    res.json(event);
  } else {
    res.status(404).json({ error: 'Event not found' });
  }
});

app.post('/api/events', (req, res) => {
  const newEvent = {
    id: Date.now().toString(),
    ...req.body,
    status: 'upcoming',
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=event-${Date.now()}-${req.body.title?.toLowerCase().replace(/\s+/g, '-')}`,
    artPieces: []
  };
  mockEvents.push(newEvent);
  res.status(201).json(newEvent);
});

// Add art piece to event
app.post('/api/events/:id/art-pieces', (req, res) => {
  const event = mockEvents.find(e => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }

  const newArtPiece = {
    id: Date.now().toString(),
    title: req.body.title,
    description: req.body.description,
    imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    artistId: req.body.artistId,
    price: req.body.price || 0,
    aiGenerated: false,
    qrCode: `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=artpiece-${Date.now()}-${req.body.title?.toLowerCase().replace(/\s+/g, '-')}`,
    descriptions: [],
    aiSummary: null,
    aiPoem: null,
    aiGeneratedArt: null,
    aiModel: null,
    createdAt: new Date().toISOString()
  };

  event.artPieces.push(newArtPiece);
  res.status(201).json(newArtPiece);
});

// Add description to specific art piece
app.post('/api/art-pieces/:artPieceId/descriptions', (req, res) => {
  // Find the art piece in any event
  let artPiece = null;
  let event = null;
  
  for (const e of mockEvents) {
    artPiece = e.artPieces.find(p => p.id === req.params.artPieceId);
    if (artPiece) {
      event = e;
      break;
    }
  }

  if (!artPiece) {
    return res.status(404).json({ error: 'Art piece not found' });
  }

  const newDescription = {
    id: Date.now().toString(),
    text: req.body.description,
    timestamp: new Date().toISOString()
  };

  artPiece.descriptions.push(newDescription);
  res.status(201).json(newDescription);
});

// Generate AI content from art piece descriptions
app.post('/api/art-pieces/:artPieceId/generate-ai-content', (req, res) => {
  // Find the art piece in any event
  let artPiece = null;
  let event = null;
  
  for (const e of mockEvents) {
    artPiece = e.artPieces.find(p => p.id === req.params.artPieceId);
    if (artPiece) {
      event = e;
      break;
    }
  }

  if (!artPiece) {
    return res.status(404).json({ error: 'Art piece not found' });
  }

  if (artPiece.descriptions.length === 0) {
    return res.status(400).json({ error: 'No descriptions available for this art piece' });
  }

  // Combine all descriptions into a prompt
  const combinedDescriptions = artPiece.descriptions.map(d => d.text).join('. ');
  const prompt = `Create an artistic representation of: ${combinedDescriptions}`;

  // Mock AI response with delay to simulate processing
  setTimeout(() => {
    const aiArtUrl = 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400';
    const aiSummary = `A beautiful artistic representation capturing the essence of: ${combinedDescriptions}`;
    const aiPoem = `In moments captured, stories unfold\nThrough art and light, memories are told\nEach experience, a brushstroke true\nCreating beauty, fresh and new`;
    const aiModel = 'DALL-E 3 + GPT-4';

    // Update the art piece
    artPiece.aiGenerated = true;
    artPiece.aiSummary = aiSummary;
    artPiece.aiPoem = aiPoem;
    artPiece.aiGeneratedArt = aiArtUrl;
    artPiece.aiModel = aiModel;

    // Add to marketplace
    const marketplaceListing = {
      id: Date.now().toString(),
      title: artPiece.title,
      description: artPiece.description,
      imageUrl: artPiece.imageUrl,
      artistId: artPiece.artistId,
      artistName: mockArtists.find(a => a.id === artPiece.artistId)?.name || 'Unknown Artist',
      eventId: event.id,
      eventTitle: event.title,
      artPieceId: artPiece.id,
      price: artPiece.price,
      aiGenerated: true,
      aiSummary,
      aiPoem,
      aiGeneratedArt: aiArtUrl,
      aiModel,
      createdAt: new Date().toISOString()
    };
    mockMarketplace.push(marketplaceListing);

    res.json({
      artPiece,
      marketplaceListing
    });
  }, 3000);
});

// Get marketplace listings
app.get('/api/marketplace', (req, res) => {
  res.json(mockMarketplace);
});

// Get marketplace listing by ID
app.get('/api/marketplace/:id', (req, res) => {
  const listing = mockMarketplace.find(l => l.id === req.params.id);
  if (listing) {
    res.json(listing);
  } else {
    res.status(404).json({ error: 'Listing not found' });
  }
});

// AI Generation endpoint (mock)
app.post('/api/generate-art', (req, res) => {
  const { prompt, style } = req.body;
  
  // Mock AI response
  setTimeout(() => {
    res.json({
      id: Date.now().toString(),
      prompt,
      style,
      imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
      status: 'completed'
    });
  }, 2000);
});

// Serve React app for all other routes (only in production)
if (process.env.NODE_ENV === 'production') {
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 API available at http://localhost:${PORT}/api`);
}); 