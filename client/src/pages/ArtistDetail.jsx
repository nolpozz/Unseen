import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Star, DollarSign, Calendar, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'

const ArtistDetail = () => {
  const { id } = useParams()
  const [artist, setArtist] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchArtist()
  }, [id])

  const fetchArtist = async () => {
    try {
      const response = await fetch(`/api/artists/${id}`)
      const data = await response.json()
      setArtist(data)
    } catch (error) {
      console.error('Error fetching artist:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading artist details...</div>
  }

  if (!artist) {
    return <div className="error">Artist not found</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to="/artists" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: '#667eea', 
        textDecoration: 'none',
        marginBottom: '2rem'
      }}>
        <ArrowLeft size={20} />
        Back to Artists
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        {/* Artist Info */}
        <div>
          <img 
            src={artist.image} 
            alt={artist.name}
            style={{
              width: '100%',
              borderRadius: '16px',
              marginBottom: '1.5rem'
            }}
          />
          <div className="card">
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              {artist.name}
            </h1>
            <p style={{ 
              color: '#667eea', 
              fontSize: '1.1rem', 
              marginBottom: '1rem' 
            }}>
              {artist.specialty}
            </p>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <Star size={20} style={{ color: '#ffd700' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{artist.rating}</span>
            </div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1.5rem'
            }}>
              <DollarSign size={20} style={{ color: '#667eea' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${artist.hourlyRate}/hr</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }}>
              Book Artist
            </button>
          </div>
        </div>

        {/* Artist Details */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              About
            </h2>
            <p style={{ 
              color: '#cccccc', 
              lineHeight: '1.6',
              fontSize: '1.1rem'
            }}>
              {artist.description}
            </p>
          </div>

          <div className="card">
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Portfolio
            </h2>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '1rem' 
            }}>
              {artist.portfolio.map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Portfolio ${index + 1}`}
                  style={{
                    width: '100%',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ArtistDetail 