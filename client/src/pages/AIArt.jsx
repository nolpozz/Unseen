import React, { useState } from 'react'
import { Sparkles, Download, RefreshCw } from 'lucide-react'

const AIArt = () => {
  const [prompt, setPrompt] = useState('')
  const [style, setStyle] = useState('realistic')
  const [generating, setGenerating] = useState(false)
  const [generatedImage, setGeneratedImage] = useState(null)

  const handleGenerate = async () => {
    if (!prompt.trim()) return

    setGenerating(true)
    try {
      const response = await fetch('/api/generate-art', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, style }),
      })
      const data = await response.json()
      setGeneratedImage(data)
    } catch (error) {
      console.error('Error generating art:', error)
    } finally {
      setGenerating(false)
    }
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
          AI Art Generator
        </h1>
        <p style={{ color: '#cccccc', fontSize: '1.1rem' }}>
          Create stunning artwork with AI
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
        {/* Input Section */}
        <div className="card">
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Sparkles size={24} style={{ color: '#667eea' }} />
            Generate Art
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold' 
            }}>
              Describe your vision
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene landscape with mountains at sunset..."
              style={{
                width: '100%',
                minHeight: '120px',
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

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '0.5rem', 
              fontWeight: 'bold' 
            }}>
              Art Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                color: 'white',
                fontSize: '1rem'
              }}
            >
              <option value="realistic">Realistic</option>
              <option value="abstract">Abstract</option>
              <option value="cartoon">Cartoon</option>
              <option value="watercolor">Watercolor</option>
              <option value="digital">Digital Art</option>
            </select>
          </div>

          <button 
            onClick={handleGenerate}
            disabled={generating || !prompt.trim()}
            className="btn btn-primary"
            style={{ width: '100%' }}
          >
            {generating ? (
              <>
                <RefreshCw size={20} style={{ animation: 'spin 1s linear infinite' }} />
                Generating...
              </>
            ) : (
              <>
                <Sparkles size={20} />
                Generate Art
              </>
            )}
          </button>
        </div>

        {/* Output Section */}
        <div className="card">
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: 'bold', 
            marginBottom: '1.5rem' 
          }}>
            Generated Artwork
          </h2>
          
          {generating ? (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '400px',
              color: '#667eea'
            }}>
              <RefreshCw size={48} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
              <p>Creating your masterpiece...</p>
            </div>
          ) : generatedImage ? (
            <div>
              <img 
                src={generatedImage.imageUrl} 
                alt="Generated Art"
                style={{
                  width: '100%',
                  borderRadius: '12px',
                  marginBottom: '1rem'
                }}
              />
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ color: '#cccccc', marginBottom: '0.5rem' }}>
                  <strong>Prompt:</strong> {generatedImage.prompt}
                </p>
                <p style={{ color: '#cccccc' }}>
                  <strong>Style:</strong> {generatedImage.style}
                </p>
              </div>
              <button className="btn btn-secondary" style={{ width: '100%' }}>
                <Download size={20} />
                Download
              </button>
            </div>
          ) : (
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              justifyContent: 'center',
              height: '400px',
              color: '#666',
              border: '2px dashed rgba(255, 255, 255, 0.2)',
              borderRadius: '12px'
            }}>
              <Sparkles size={48} style={{ marginBottom: '1rem' }} />
              <p>Your generated artwork will appear here</p>
            </div>
          )}
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

export default AIArt 