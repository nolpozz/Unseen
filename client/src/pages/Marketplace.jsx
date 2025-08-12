import React, { useState, useEffect } from 'react'
import { DollarSign, Sparkles, Calendar, User, Tag } from 'lucide-react'

const Marketplace = () => {
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedListing, setSelectedListing] = useState(null)

  useEffect(() => {
    fetchListings()
  }, [])

  const fetchListings = async () => {
    try {
      const response = await fetch('/api/marketplace')
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Error fetching marketplace listings:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading marketplace...</div>
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
          AI Art Marketplace
        </h1>
        <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
          Discover unique AI-generated artwork created from event experiences
        </p>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
        gap: '2rem' 
      }}>
        {listings.map(listing => (
          <div key={listing.id} className="card" style={{ cursor: 'pointer' }} onClick={() => setSelectedListing(listing)}>
            <img 
              src={listing.imageUrl} 
              alt={listing.title}
              style={{
                width: '100%',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1rem'
              }}
            />
            
            <div style={{ marginBottom: '1rem' }}>
              <h3 style={{ 
                fontSize: '1.25rem', 
                fontWeight: 'bold', 
                marginBottom: '0.5rem' 
              }}>
                {listing.title}
              </h3>
              <p style={{ 
                color: '#cccccc', 
                fontSize: '0.9rem',
                marginBottom: '0.5rem'
              }}>
                {listing.description}
              </p>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem',
              color: '#cccccc',
              fontSize: '0.9rem'
            }}>
              <User size={16} />
              <span>{listing.artistName}</span>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '0.5rem',
              color: '#cccccc',
              fontSize: '0.9rem'
            }}>
              <Calendar size={16} />
              <span>{listing.eventTitle}</span>
            </div>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem',
              color: '#667eea',
              fontSize: '0.9rem'
            }}>
              <Tag size={16} />
              <span>{listing.aiModel}</span>
            </div>

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
                <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>${listing.price}</span>
              </div>
              {listing.aiGenerated && (
                <span style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                  fontWeight: 'bold',
                  background: 'rgba(102, 126, 234, 0.2)',
                  color: '#667eea',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem'
                }}>
                  <Sparkles size={12} />
                  AI Generated
                </span>
              )}
            </div>

            <button className="btn btn-primary" style={{ width: '100%' }}>
              View Details
            </button>
          </div>
        ))}
      </div>

      {/* Modal for listing details */}
      {selectedListing && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '2rem'
        }}>
          <div className="card" style={{ 
            maxWidth: '800px', 
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                fontSize: '2rem', 
                fontWeight: 'bold' 
              }}>
                {selectedListing.title}
              </h2>
              <button 
                onClick={() => setSelectedListing(null)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#666',
                  cursor: 'pointer',
                  padding: '0.5rem',
                  fontSize: '1.5rem'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
              <img 
                src={selectedListing.imageUrl} 
                alt={selectedListing.title}
                style={{
                  width: '100%',
                  borderRadius: '12px'
                }}
              />
              
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  Artwork Details
                </h3>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Artist:</strong> {selectedListing.artistName}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Event:</strong> {selectedListing.eventTitle}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>AI Model:</strong> {selectedListing.aiModel}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Price:</strong> ${selectedListing.price}
                </div>
                
                <div style={{ marginBottom: '1rem' }}>
                  <strong>Created:</strong> {new Date(selectedListing.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            {selectedListing.aiGenerated && (
              <div style={{ marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                  AI Generated Content
                </h3>
                
                <div className="card" style={{ marginBottom: '1rem' }}>
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Summary</h4>
                  <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                    {selectedListing.aiSummary}
                  </p>
                </div>
                
                <div className="card">
                  <h4 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Poem</h4>
                  <p style={{ 
                    color: '#cccccc', 
                    lineHeight: '1.8',
                    fontStyle: 'italic',
                    whiteSpace: 'pre-line'
                  }}>
                    {selectedListing.aiPoem}
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                Purchase Artwork
              </button>
              <button 
                onClick={() => setSelectedListing(null)}
                className="btn btn-secondary" 
                style={{ flex: 1 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {listings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            No AI-generated artwork available yet.
          </p>
        </div>
      )}
    </div>
  )
}

export default Marketplace 