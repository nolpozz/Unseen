import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Artists from './pages/Artists'
import ArtistDetail from './pages/ArtistDetail'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import ArtPieceDetail from './pages/ArtPieceDetail'
import AIArt from './pages/AIArt'
import Marketplace from './pages/Marketplace'

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/artists" element={<Artists />} />
            <Route path="/artists/:id" element={<ArtistDetail />} />
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<EventDetail />} />
            <Route path="/art-pieces/:artPieceId" element={<ArtPieceDetail />} />
            <Route path="/ai-art" element={<AIArt />} />
            <Route path="/marketplace" element={<Marketplace />} />
          </Routes>
        </main>
      </div>
    </Router>
  )
}

export default App 