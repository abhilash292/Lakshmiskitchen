import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/client'

const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;1,9..144,200&family=Inter:wght@300;400;500&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

export default function RegisterPage() {
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await api.post('/users/register', form)
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF7', fontFamily: 'Inter, sans-serif', display: 'flex' }}>

      {/* LEFT — branding panel */}
      <div style={{
        width: '45%', background: '#1A1008',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', padding: '48px 56px',
      }}>
        <Link to="/" style={{ textDecoration: 'none' }}>
          <div style={{ fontFamily: 'Fraunces, serif', fontSize: 18, fontWeight: 300, color: '#FAFAF7', letterSpacing: '-0.01em' }}>
            Lakshmi Home Foods
          </div>
        </Link>

        <div>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.35)', marginBottom: 24 }}>
            Telangana · Homemade · Ships across India
          </div>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(32px,3.5vw,52px)', fontWeight: 200, lineHeight: 1.1, letterSpacing: '-0.02em', color: '#FAFAF7', marginBottom: 20 }}>
            Amma's kitchen.<br /><em style={{ fontStyle: 'italic', color: '#D97455' }}>Delivered to yours.</em>
          </h2>
          <p style={{ fontSize: 15, fontWeight: 300, color: 'rgba(250,250,247,0.45)', lineHeight: 1.75, maxWidth: 360 }}>
            Join thousands of families enjoying homemade Telangana flavors. Pickles, podulu, snacks and sweets — made fresh, shipped to your door.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 40 }}>
          {[{ n: '40+', l: 'Years of recipes' }, { n: '0', l: 'Preservatives' }, { n: '24h', l: 'Ships next day' }].map(s => (
            <div key={s.n}>
              <div style={{ fontFamily: 'Fraunces, serif', fontSize: 24, fontWeight: 300, color: '#FAFAF7' }}>{s.n}</div>
              <div style={{ fontSize: 11, color: 'rgba(250,250,247,0.35)', marginTop: 3 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — form panel */}
      <div style={{
        flex: 1, display: 'flex', flexDirection: 'column',
        justifyContent: 'center', padding: '48px 80px',
      }}>
        <div style={{ maxWidth: 480, width: '100%' }}>

          {/* header */}
          <div style={{ marginBottom: 48 }}>
            <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4583A', marginBottom: 12 }}>
              Get started
            </div>
            <h1 style={{ fontFamily: 'Fraunces, serif', fontSize: 'clamp(28px,3vw,42px)', fontWeight: 200, letterSpacing: '-0.02em', color: '#1A1008', lineHeight: 1.1, marginBottom: 10 }}>
              Create your account
            </h1>
            <p style={{ fontSize: 15, color: '#887A6C', fontWeight: 300 }}>
              Already have an account?{' '}
              <Link to="/login" style={{ color: '#C4583A', fontWeight: 500, textDecoration: 'none' }}>Sign in</Link>
            </p>
          </div>

          {/* error */}
          {error && (
            <div style={{ background: '#FEF2F0', border: '1px solid #FCCDC7', color: '#C4583A', borderRadius: 10, padding: '12px 16px', marginBottom: 24, fontSize: 14 }}>
              {error}
            </div>
          )}

          {/* form */}
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#1A1008', marginBottom: 6, letterSpacing: '0.02em' }}>Full name</label>
                <input
                  name="fullName" type="text" value={form.fullName}
                  onChange={handleChange} placeholder="Priya Sharma" required
                  style={{ width: '100%', background: '#FFFFFF', border: '1px solid #EBEBEB', borderRadius: 10, padding: '13px 16px', fontSize: 14, color: '#1A1008', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#C4583A'}
                  onBlur={e => e.target.style.borderColor = '#EBEBEB'}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#1A1008', marginBottom: 6, letterSpacing: '0.02em' }}>Phone number</label>
                <input
                  name="phone" type="tel" value={form.phone}
                  onChange={handleChange} placeholder="9876543210" required
                  style={{ width: '100%', background: '#FFFFFF', border: '1px solid #EBEBEB', borderRadius: 10, padding: '13px 16px', fontSize: 14, color: '#1A1008', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                  onFocus={e => e.target.style.borderColor = '#C4583A'}
                  onBlur={e => e.target.style.borderColor = '#EBEBEB'}
                />
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#1A1008', marginBottom: 6, letterSpacing: '0.02em' }}>Email address</label>
              <input
                name="email" type="email" value={form.email}
                onChange={handleChange} placeholder="you@example.com" required
                style={{ width: '100%', background: '#FFFFFF', border: '1px solid #EBEBEB', borderRadius: 10, padding: '13px 16px', fontSize: 14, color: '#1A1008', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#C4583A'}
                onBlur={e => e.target.style.borderColor = '#EBEBEB'}
              />
            </div>

            <div style={{ marginBottom: 32 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 500, color: '#1A1008', marginBottom: 6, letterSpacing: '0.02em' }}>Password</label>
              <input
                name="password" type="password" value={form.password}
                onChange={handleChange} placeholder="Min. 8 characters" required
                style={{ width: '100%', background: '#FFFFFF', border: '1px solid #EBEBEB', borderRadius: 10, padding: '13px 16px', fontSize: 14, color: '#1A1008', outline: 'none', fontFamily: 'Inter, sans-serif', transition: 'border-color 0.2s' }}
                onFocus={e => e.target.style.borderColor = '#C4583A'}
                onBlur={e => e.target.style.borderColor = '#EBEBEB'}
              />
            </div>

            <button
              type="submit" disabled={loading}
              style={{ width: '100%', background: loading ? '#E0D6C8' : '#C4583A', color: 'white', fontSize: 15, fontWeight: 500, padding: '15px 24px', borderRadius: 10, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'Inter, sans-serif', transition: 'background 0.2s, transform 0.2s', marginBottom: 16 }}
              onMouseEnter={e => { if (!loading) e.target.style.background = '#D97455' }}
              onMouseLeave={e => { if (!loading) e.target.style.background = '#C4583A' }}>
              {loading ? 'Creating account...' : 'Create account →'}
            </button>

            <p style={{ fontSize: 12, color: '#887A6C', textAlign: 'center', lineHeight: 1.6, fontWeight: 300 }}>
              By creating an account you agree to our{' '}
              <span style={{ color: '#C4583A', cursor: 'pointer' }}>Terms of Service</span>
              {' '}and{' '}
              <span style={{ color: '#C4583A', cursor: 'pointer' }}>Privacy Policy</span>
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}