import React, { useState, useEffect } from 'react'
import { Calendar, MapPin, Clock, QrCode } from 'lucide-react'
import QRScanner from '../components/QRScanner'

const Events = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showQRScanner, setShowQRScanner] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      setEvents(data)
      setError(null)
    } catch (error) {
      console.error('Error fetching events:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleQRScan = (eventId) => {
    setShowQRScanner(false)
    // Navigate to event detail page
    window.location.href = `/events/${eventId}`
  }


  
  if (loading) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="loading">Loading events...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
        <div className="error">
          <h2>Error loading events</h2>
          <p>{error}</p>
          <button onClick={fetchEvents} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    )
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
          Events
        </h1>
        <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
          Track your upcoming and past events
        </p>
        <button 
          onClick={() => setShowQRScanner(true)}
          className="btn btn-primary"
          style={{ marginTop: '1rem' }}
        >
          <QrCode size={20} />
          Scan Event QR Code
        </button>
      </div>

      {events.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
            No events found. Create your first event!
          </p>
        </div>
      ) : (
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', 
          gap: '2rem' 
        }}>
          {events.map(event => (
            <div key={event.id} className="card">
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'flex-start',
                marginBottom: '1rem'
              }}>
                <h3 style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 'bold' 
                }}>
                  {event.title}
                </h3>
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
                marginBottom: '1rem',
                color: '#cccccc'
              }}>
                <MapPin size={16} />
                <span>{event.location}</span>
              </div>
              
              <a 
                href={`/events/${event.id}`}
                className="btn btn-secondary"
                style={{ width: '100%', textAlign: 'center' }}
              >
                View Details
              </a>
            </div>
          ))}
        </div>
      )}

      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan}
          onClose={() => setShowQRScanner(false)}
        />
      )}
    </div>
  )
}

export default Events 