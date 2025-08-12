import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, QrCode, MessageCircle, Sparkles, Download, DollarSign, Palette } from 'lucide-react'
import { Link } from 'react-router-dom'

const ArtPieceDetail = () => {
  const { artPieceId } = useParams()
  const [artPiece, setArtPiece] = useState(null)
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [newDescription, setNewDescription] = useState('')
  const [generatingAI, setGeneratingAI] = useState(false)

  useEffect(() => {
    fetchArtPiece()
  }, [artPieceId])

  const fetchArtPiece = async () => {
    try {
      // Find the art piece by searching through all events
      const eventsResponse = await fetch('/api/events')
      const events = await eventsResponse.json()
      
      let foundArtPiece = null
      let foundEvent = null
      
      for (const event of events) {
        const piece = event.artPieces.find(p => p.id === artPieceId)
        if (piece) {
          foundArtPiece = piece
          foundEvent = event
          break
        }
      }
      
      if (foundArtPiece) {
        setArtPiece(foundArtPiece)
        setEvent(foundEvent)
      }
    } catch (error) {
      console.error('Error fetching art piece:', error)
    } finally {
      setLoading(false)
    }
  }

  const addDescription = async () => {
    if (!newDescription.trim()) return

    try {
      const response = await fetch(`/api/art-pieces/${artPieceId}/descriptions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ description: newDescription }),
      })
      
      if (response.ok) {
        setNewDescription('')
        fetchArtPiece() // Refresh art piece data
      }
    } catch (error) {
      console.error('Error adding description:', error)
    }
  }

  const generateAIContent = async () => {
    setGeneratingAI(true)
    try {
      const response = await fetch(`/api/art-pieces/${artPieceId}/generate-ai-content`, {
        method: 'POST',
      })
      
      if (response.ok) {
        const data = await response.json()
        fetchArtPiece() // Refresh art piece data
      }
    } catch (error) {
      console.error('Error generating AI content:', error)
    } finally {
      setGeneratingAI(false)
    }
  }

  if (loading) {
    return <div className="loading">Loading art piece details...</div>
  }

  if (!artPiece || !event) {
    return <div className="error">Art piece not found</div>
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      <Link to={`/events/${event.id}`} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '0.5rem', 
        color: '#667eea', 
        textDecoration: 'none',
        marginBottom: '2rem'
      }}>
        <ArrowLeft size={20} />
        Back to {event.title}
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
        {/* Art Piece Info & QR Code */}
        <div>
          <div className="card" style={{ marginBottom: '2rem' }}>
            <img 
              src={artPiece.imageUrl} 
              alt={artPiece.title}
              style={{
                width: '100%',
                borderRadius: '16px',
                marginBottom: '1.5rem'
              }}
            />
            
            <h1 style={{ 
              fontSize: '2rem', 
              fontWeight: 'bold', 
              marginBottom: '0.5rem' 
            }}>
              {artPiece.title}
            </h1>
            
            <p style={{ 
              color: '#cccccc', 
              fontSize: '1.1rem', 
              marginBottom: '1rem',
              lineHeight: '1.6'
            }}>
              {artPiece.description}
            </p>

            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              marginBottom: '1rem'
            }}>
              <DollarSign size={20} style={{ color: '#667eea' }} />
              <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>${artPiece.price}</span>
            </div>

            {artPiece.aiGenerated && (
              <div style={{
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: 'bold',
                background: 'rgba(102, 126, 234, 0.2)',
                color: '#667eea',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginBottom: '1rem'
              }}>
                <Sparkles size={16} />
                AI Generated Content Available
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="card" style={{ textAlign: 'center' }}>
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
              Art Piece QR Code
            </h3>
            <img 
              src={artPiece.qrCode} 
              alt="Art Piece QR Code"
              style={{
                width: '200px',
                height: '200px',
                marginBottom: '1rem'
              }}
            />
            <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
              Scan this QR code to add your description of this art piece
            </p>
          </div>
        </div>

        {/* Descriptions & AI Content */}
        <div>
          {/* Add Description */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <MessageCircle size={24} style={{ color: '#667eea' }} />
              Describe This Art Piece
            </h2>
            
            <div style={{ marginBottom: '1rem' }}>
              <textarea
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What do you see in this art piece? How does it make you feel? What does it remind you of?"
                style={{
                  width: '100%',
                  minHeight: '100px',
                  padding: '1rem',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  color: 'white',
                  fontSize: '1rem',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <button 
              onClick={addDescription}
              disabled={!newDescription.trim()}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              Add Description
            </button>
          </div>

          {/* Descriptions List */}
          <div className="card" style={{ marginBottom: '2rem' }}>
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem' 
            }}>
              Art Piece Descriptions ({artPiece.descriptions.length})
            </h2>
            
            {artPiece.descriptions.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center', padding: '2rem' }}>
                No descriptions yet. Be the first to describe this art piece!
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {artPiece.descriptions.map(description => (
                  <div key={description.id} style={{
                    padding: '1rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <p style={{ color: '#cccccc', marginBottom: '0.5rem' }}>
                      {description.text}
                    </p>
                    <small style={{ color: '#666' }}>
                      {new Date(description.timestamp).toLocaleString()}
                    </small>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* AI Content Generation */}
          {artPiece.descriptions.length > 0 && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold', 
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <Sparkles size={24} style={{ color: '#667eea' }} />
                AI Content Generation
              </h2>
              
              {artPiece.aiGenerated ? (
                <div>
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Summary</h3>
                    <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
                      {artPiece.aiSummary}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Poem</h3>
                    <p style={{ 
                      color: '#cccccc', 
                      lineHeight: '1.8',
                      fontStyle: 'italic',
                      whiteSpace: 'pre-line'
                    }}>
                      {artPiece.aiPoem}
                    </p>
                  </div>
                  
                  <div style={{ marginBottom: '2rem' }}>
                    <h3 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>AI Generated Art</h3>
                    <img 
                      src={artPiece.aiGeneratedArt} 
                      alt="AI Generated Art"
                      style={{
                        width: '100%',
                        borderRadius: '12px',
                        marginBottom: '1rem'
                      }}
                    />
                    <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                      AI Model: {artPiece.aiModel}
                    </p>
                  </div>
                  
                  <button className="btn btn-secondary" style={{ width: '100%' }}>
                    <Download size={20} />
                    Download AI Content
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
                    Generate AI summary, poem, and artwork from {artPiece.descriptions.length} descriptions of this art piece.
                  </p>
                  <button 
                    onClick={generateAIContent}
                    disabled={generatingAI}
                    className="btn btn-primary"
                    style={{ width: '100%' }}
                  >
                    {generatingAI ? (
                      <>
                        <Sparkles size={20} style={{ animation: 'spin 1s linear infinite' }} />
                        Generating AI Content...
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        Generate AI Content
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Event Info */}
          <div className="card">
            <h2 style={{ 
              fontSize: '1.5rem', 
              fontWeight: 'bold', 
              marginBottom: '1rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
              <Palette size={24} style={{ color: '#667eea' }} />
              Event Information
            </h2>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Event:</strong> {event.title}
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </div>
            
            <div style={{ marginBottom: '0.5rem' }}>
              <strong>Location:</strong> {event.location}
            </div>
            
            <div style={{ marginBottom: '1rem' }}>
              <strong>Status:</strong> {event.status}
            </div>
            
            <Link to={`/events/${event.id}`} className="btn btn-secondary" style={{ width: '100%' }}>
              View Event Details
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}

export default ArtPieceDetail 