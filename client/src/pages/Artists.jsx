import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Star, DollarSign, Search } from 'lucide-react'

const Artists = () => {
  const [artists, setArtists] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchArtists()
  }, [])

  const fetchArtists = async () => {
    try {
      const response = await fetch('/api/artists')
      const data = await response.json()
      setArtists(data)
    } catch (error) {
      console.error('Error fetching artists:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredArtists = artists.filter(artist =>
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return <div className="loading">Loading artists...</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Discover Artists
        </h1>
        <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
          Find the perfect artist for your next event
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ 
        position: 'relative', 
        marginBottom: '2rem',
        maxWidth: '500px'
      }}>
        <Search size={20} style={{ 
          position: 'absolute', 
          left: '1rem', 
          top: '50%', 
          transform: 'translateY(-50%)',
          color: '#666'
        }} />
        <input
          type="text"
          placeholder="Search artists by name or specialty..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '1rem 1rem 1rem 3rem',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '12px',
            background: 'rgba(255, 255, 255, 0.05)',
            color: 'white',
            fontSize: '1rem'
          }}
        />
      </div>

      {/* Artists Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        {filteredArtists.map(artist => (
          <div key={artist.id} className="card">
            <div style={{ 
              display: 'flex', 
              gap: '1rem', 
              marginBottom: '1rem' 
            }}>
              <img 
                src={artist.image} 
                alt={artist.name}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
              <div style={{ flex: 1 }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold', 
                  marginBottom: '0.5rem' 
                }}>
                  {artist.name}
                </h3>
                <p style={{ 
                  color: '#667eea', 
                  fontSize: '0.9rem', 
                  marginBottom: '0.5rem' 
                }}>
                  {artist.specialty}
                </p>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem' 
                }}>
                  <Star size={16} style={{ color: '#ffd700' }} />
                  <span style={{ fontSize: '0.9rem' }}>{artist.rating}</span>
                </div>
              </div>
            </div>
            
            <p style={{ 
              color: '#cccccc', 
              marginBottom: '1rem',
              lineHeight: '1.5'
            }}>
              {artist.description}
            </p>
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.25rem' 
              }}>
                <DollarSign size={16} style={{ color: '#667eea' }} />
                <span style={{ fontWeight: 'bold' }}>${artist.hourlyRate}/hr</span>
              </div>
            </div>
            
            <Link 
              to={`/artists/${artist.id}`} 
              className="btn btn-primary"
              style={{ width: '100%', textAlign: 'center' }}
            >
              View Profile
            </Link>
          </div>
        ))}
      </div>

      {filteredArtists.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            No artists found matching your search.
          </p>
        </div>
      )}
    </div>
  )
}

export default Artists 