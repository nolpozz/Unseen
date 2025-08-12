# 🎨 Unseen AI Art Experience Platform - Demo Guide

## 🚀 Quick Start

**Single Command Demo:**
```bash
npm run demo
```

This will automatically:
- ✅ Install all dependencies
- ✅ Start both servers (frontend + backend)
- ✅ Open your browser to http://localhost:3000
- ✅ Show interactive demo instructions

---

## 🎪 Demo Walkthrough

### Step 1: Explore the Platform
1. **Home Page**: Overview of the platform
2. **Artists**: Browse available artists (Sarah Chen, Marcus Rodriguez, Emma Thompson)
3. **Events**: View upcoming and completed events

### Step 2: Interactive Art Experience
1. **Click "Events"** → View "Corporate Art Exhibition"
2. **Click "View Details"** on "Abstract Corporate" art piece
3. **Add a description** like: *"This piece feels dynamic and energetic with flowing lines that represent movement"*
4. **Click "Generate AI Content"** → Creates AI summary, poem, and artwork
5. **Visit "Marketplace"** → See the generated content listed for purchase

### Step 3: QR Code Experience
1. **Click "Scan Event QR Code"** on Events page
2. **Use the mock QR scanner** to simulate real-world usage
3. **Experience** how attendees would interact with art pieces

---

## 🎯 Key Features to Demo

### 🎨 **Art Piece Management**
- Each art piece has its own QR code
- Individual descriptions for each piece
- AI content generation from descriptions

### 🤖 **AI Content Generation**
- **AI Summary**: Descriptive text about the art piece
- **AI Poem**: Creative poetry inspired by descriptions
- **AI Artwork**: Visual representation of the piece

### 🛒 **Marketplace**
- Browse AI-generated content
- View pricing and artist attribution
- See event context for each piece

### 📱 **QR Code System**
- Mock QR scanner for demonstration
- Direct access to art piece details
- Real-world event simulation

---

## 🔗 URLs

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3002/api
- **API Endpoints**:
  - `GET /api/events` - List all events
  - `GET /api/artists` - List all artists
  - `GET /api/marketplace` - List marketplace items

---

## 🛠️ Troubleshooting

### If servers don't start:
```bash
npm run reset
npm run demo
```

### If browser doesn't open automatically:
- Manually open http://localhost:3000

### If ports are in use:
- The demo will automatically find available ports
- Check terminal output for actual URLs

---

## 🎉 Demo Success Indicators

✅ **Frontend loads** at http://localhost:3000  
✅ **Events page** shows "Corporate Art Exhibition"  
✅ **Art piece details** show descriptions and QR codes  
✅ **AI generation** creates summary, poem, and artwork  
✅ **Marketplace** displays AI-generated content  

---

**Ready to experience the future of interactive art! 🚀✨** 