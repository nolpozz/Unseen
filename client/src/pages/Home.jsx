import React from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star, Users, Calendar } from 'lucide-react'

const Home = () => {
  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
      {/* Hero Section */}
      <section style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 style={{ 
          fontSize: '3.5rem', 
          fontWeight: 'bold', 
          marginBottom: '1rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Discover Amazing Artists
        </h1>
        <p style={{ 
          fontSize: '1.25rem', 
          color: '#cccccc', 
          marginBottom: '2rem',
          maxWidth: '600px',
          margin: '0 auto 2rem auto'
        }}>
          Connect with talented artists for your next event. From live performances to digital art, find the perfect creative partner.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/artists" className="btn btn-primary">
            Browse Artists <ArrowRight size={20} />
          </Link>
          <Link to="/ai-art" className="btn btn-secondary">
            Generate AI Art
          </Link>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
        gap: '2rem', 
        marginBottom: '4rem' 
      }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <Users size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>500+</h3>
          <p style={{ color: '#cccccc' }}>Talented Artists</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Calendar size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>1000+</h3>
          <p style={{ color: '#cccccc' }}>Events Completed</p>
        </div>
        <div className="card" style={{ textAlign: 'center' }}>
          <Star size={48} style={{ color: '#667eea', marginBottom: '1rem' }} />
          <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>4.9</h3>
          <p style={{ color: '#cccccc' }}>Average Rating</p>
        </div>
      </section>

      {/* Features Section */}
      <section>
        <h2 style={{ 
          fontSize: '2.5rem', 
          fontWeight: 'bold', 
          textAlign: 'center', 
          marginBottom: '3rem',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Why Choose Unseen?
        </h2>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
          gap: '2rem' 
        }}>
          <div className="card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Curated Artists</h3>
            <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
              Every artist on our platform is carefully vetted and selected for their unique talent and professionalism.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>AI-Powered Matching</h3>
            <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
              Our intelligent system matches you with the perfect artist based on your event type and requirements.
            </p>
          </div>
          <div className="card">
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Secure Booking</h3>
            <p style={{ color: '#cccccc', lineHeight: '1.6' }}>
              Safe and secure payment processing with comprehensive contracts and insurance coverage.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home 