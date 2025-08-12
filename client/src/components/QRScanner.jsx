import React, { useState } from 'react'
import { QrCode, X, Smartphone } from 'lucide-react'

const QRScanner = ({ onScan, onClose }) => {
  const [isScanning, setIsScanning] = useState(false)

  const handleScan = () => {
    setIsScanning(true)
    // Mock QR code scan - in a real app, this would use a camera API
    setTimeout(() => {
      const mockEventId = '1' // Mock event ID from QR code
      onScan(mockEventId)
      setIsScanning(false)
    }, 2000)
  }

  return (
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
      zIndex: 1000
    }}>
      <div className="card" style={{ 
        maxWidth: '400px', 
        width: '90%',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <QrCode size={24} style={{ color: '#667eea' }} />
            QR Scanner
          </h2>
          <button 
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: '#666',
              cursor: 'pointer',
              padding: '0.5rem'
            }}
          >
            <X size={24} />
          </button>
        </div>

        {!isScanning ? (
          <div>
            <div style={{
              width: '200px',
              height: '200px',
              border: '2px dashed #667eea',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto',
              background: 'rgba(102, 126, 234, 0.1)'
            }}>
              <QrCode size={64} style={{ color: '#667eea' }} />
            </div>
            <p style={{ color: '#cccccc', marginBottom: '2rem' }}>
              Point your camera at an event QR code to add your experience
            </p>
            <button 
              onClick={handleScan}
              className="btn btn-primary"
              style={{ width: '100%' }}
            >
              <Smartphone size={20} />
              Start Scanning
            </button>
          </div>
        ) : (
          <div>
            <div style={{
              width: '200px',
              height: '200px',
              border: '2px solid #667eea',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 2rem auto',
              background: 'rgba(102, 126, 234, 0.2)',
              animation: 'pulse 1s infinite'
            }}>
              <QrCode size={64} style={{ color: '#667eea' }} />
            </div>
            <p style={{ color: '#cccccc', marginBottom: '2rem' }}>
              Scanning QR code...
            </p>
            <div style={{
              width: '100%',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                width: '60%',
                height: '100%',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '2px',
                animation: 'loading 2s infinite'
              }} />
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}</style>
    </div>
  )
}

export default QRScanner 