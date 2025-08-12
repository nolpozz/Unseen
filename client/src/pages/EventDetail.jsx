import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { Calendar, MapPin, ArrowLeft, QrCode, MessageCircle, Sparkles, Download, Palette, Plus, DollarSign, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'

const EventDetail = () => {
  const { id } = useParams()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [newArtPiece, setNewArtPiece] = useState({
    title: '',
    description: '',
    price: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [id])

  const fetchEvent = async () => {
    try {
      const response = await fetch(`/api/events/${id}`)
      const data = await response.json()
      setEvent(data)
    } catch (error) {
      console.error('Error fetching event:', error)
    } finally {
      setLoading(false)
    }
  }

  const addArtPiece = async () => {
    if (!newArtPiece.title.trim() || !newArtPiece.description.trim()) return

    try {
      const response = await fetch(`/api/events/${id}/art-pieces`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: newArtPiece.title,
          description: newArtPiece.description,
          price: parseInt(newArtPiece.price) || 0,
          artistId: event.artistId
        }),
      })
      
      if (response.ok) {
        setNewArtPiece({ title: '', description: '', price: '' })
        fetchEvent() // Refresh event data
      }
    } catch (error) {
      console.error('Error adding art piece:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading event details...</div>
  }

  if (!event) {
    return <div className="error">Event not found</div>
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'art-pieces', label: 'Art Pieces', icon: Palette }
  ]

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to="/events" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: '#667eea', 
        textDecoration: 'none',
        marginBottom: '2rem'
      }}>
        <ArrowLeft size={20} />
        Back to Events
      </Link>

      {/* Event Header */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem' 
        }}>
          {event.title}
        </h1>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '0.5rem',
          color: '#cccccc'
        }}>
          <Calendar size={16} />
          <span>{new Date(event.date).toLocaleDateString()}</span>
        </div>
        
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.5rem',
          marginBottom: '1.5rem',
          color: '#cccccc'
        }}>
          <MapPin size={16} />
          <span>{event.location}</span>
        </div>

        <span style={{
          padding: '0.25rem 0.75rem',
          borderRadius: '20px',
          fontSize: '0.8rem',
          fontWeight: 'bold',
          background: event.status === 'upcoming' ? 'rgba(102, 126, 234, 0.2)' : 'rgba(76, 175, 80, 0.2)',
          color: event.status === 'upcoming' ? '#667eea' : '#4caf50'
        }}>
          {event.status}
        </span>
      </div>

      {/* Event QR Code */}
      <div className="card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: '1.25rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem'
        }}>
          <QrCode size={24} style={{ color: '#667eea' }} />
          Event QR Code
        </h3>
        <img 
          src={event.qrCode} 
          alt="Event QR Code"
          style={{
            width: '200px',
            height: '200px',
            marginBottom: '1rem'
          }}
        />
        <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
          Scan this QR code to access event information
        </p>
      </div>

      {/* Tabs */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          marginBottom: '2rem'
        }}>
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === id ? '#667eea' : '#cccccc',
                padding: '1rem 2rem',
                cursor: 'pointer',
                borderBottom: activeTab === id ? '2px solid #667eea' : '2px solid transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'all 0.3s ease'
              }}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="card">
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              Event Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {event.artPieces.length}
                </h3>
                <p style={{ color: '#cccccc' }}>Art Pieces</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {event.artPieces.filter(piece => piece.aiGenerated).length}
                </h3>
                <p style={{ color: '#cccccc' }}>AI Generated</p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <h3 style={{ fontSize: '2rem', fontWeight: 'bold', color: '#667eea' }}>
                  {event.artPieces.reduce((total, piece) => total + piece.descriptions.length, 0)}
                </h3>
                <p style={{ color: '#cccccc' }}>Total Descriptions</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'art-pieces' && (
          <div>
            {/* Add New Art Piece */}
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Plus size={24} style={{ color: '#667eea' }} />
                Add Art Piece
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  placeholder="Art piece title"
                  value={newArtPiece.title}
                  onChange={(e) => setNewArtPiece({ ...newArtPiece, title: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newArtPiece.price}
                  onChange={(e) => setNewArtPiece({ ...newArtPiece, price: e.target.value })}
                  style={{
                    padding: '0.75rem',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px',
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    fontSize: '1rem'
                  }}
                />
              </div>
              
              <textarea
                placeholder="Art piece description"
                value={newArtPiece.description}
                onChange={(e) => setNewArtPiece({ ...newArtPiece, description: e.target.value })}
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical',
                  marginBottom: '1rem'
                }}
              />
              
              <button 
                onClick={addArtPiece}
                disabled={!newArtPiece.title.trim() || !newArtPiece.description.trim()}
                className="btn btn-primary"
                style={{ width: '100%' }}
              >
                Add Art Piece
              </button>
            </div>

            {/* Art Pieces Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', 
              gap: '2rem' 
            }}>
              {event.artPieces.map(piece => (
                <div key={piece.id} className="card">
                  <img 
                    src={piece.imageUrl} 
                    alt={piece.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '1rem'
                    }}
                  />
                  
                  <h3 style={{ 
                    fontSize: '1.25rem', 
                    fontWeight: 'bold', 
                    marginBottom: '0.5rem' 
                  }}>
                    {piece.title}
                  </h3>
                  
                  <p style={{ 
                    color: '#cccccc', 
                    marginBottom: '1rem',
                    lineHeight: '1.5'
                  }}>
                    {piece.description}
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
                      <span style={{ fontWeight: 'bold' }}>${piece.price}</span>
                    </div>
                    {piece.aiGenerated && (
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

                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    marginBottom: '1rem',
                    color: '#cccccc',
                    fontSize: '0.9rem'
                  }}>
                    <MessageCircle size={16} />
                    <span>{piece.descriptions.length} descriptions</span>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link 
                      to={`/art-pieces/${piece.id}`}
                      className="btn btn-primary"
                      style={{ flex: 1, textAlign: 'center' }}
                    >
                      <Eye size={16} />
                      View Details
                    </Link>
                    <button className="btn btn-secondary">
                      <Download size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {event.artPieces.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem' }}>
                <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
                  No art pieces yet. Add your first piece!
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default EventDetail 