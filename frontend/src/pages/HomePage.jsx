import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import api from '../api/client'

const fontLink = document.createElement('link')
fontLink.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,200;0,9..144,300;1,9..144,200;1,9..144,300&family=Inter:wght@300;400;500&display=swap'
fontLink.rel = 'stylesheet'
document.head.appendChild(fontLink)

const CATEGORIES = ['All', 'PICKLES', 'PODULU', 'SNACKS', 'SWEETS']
const CAT_LABEL = { All: '🛍️ All', PICKLES: '🥫 Pickles', PODULU: '🌾 Podulu', SNACKS: '🍘 Snacks', SWEETS: '🍬 Sweets' }
const CAT_EMOJI = { PICKLES: '🥫', PODULU: '🌾', SNACKS: '🍘', SWEETS: '🍬' }

const gStyle = document.createElement('style')
gStyle.textContent = `
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #FAFAF7; -webkit-font-smoothing: antialiased; }
  .fraunces { font-family: 'Fraunces', serif; }
  .inter { font-family: 'Inter', sans-serif; }
`
document.head.appendChild(gStyle)

export default function HomePage() {
  const [dishes, setDishes] = useState([])
  const [category, setCategory] = useState('All')
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart') || '[]'))
  const [loading, setLoading] = useState(true)
  const [addedId, setAddedId] = useState(null)
  const { user, logout, isAdmin } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/menu')
      .then(r => setDishes(r.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const cartCount = cart.reduce((s, i) => s + i.quantity, 0)

  const addToCart = dish => {
    setCart(prev => {
      const ex = prev.find(i => i.id === dish.id)
      return ex
        ? prev.map(i => i.id === dish.id ? { ...i, quantity: i.quantity + 1 } : i)
        : [...prev, { ...dish, quantity: 1 }]
    })
    setAddedId(dish.id)
    setTimeout(() => setAddedId(null), 1400)
  }

  const filtered = category === 'All' ? dishes : dishes.filter(d => d.category === category)

  return (
    <div style={{ fontFamily: 'Inter, sans-serif', background: '#FAFAF7', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 500,
        height: 52, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 40px',
        background: 'rgba(250,250,247,0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '0.5px solid #E5DDD0',
      }}>
        <div className="fraunces" style={{ fontSize: 16, fontWeight: 300, color: '#1A1008', letterSpacing: '-0.01em' }}>
          Lakshmi Home Foods
        </div>
        <div style={{ display: 'flex', gap: 32, position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          {['Story', 'Kitchen', 'Shop', 'Shipping'].map(l => (
            <span key={l} style={{ fontSize: 13, color: '#887A6C', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={e => e.target.style.color = '#1A1008'}
              onMouseLeave={e => e.target.style.color = '#887A6C'}>
              {l}
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          {user ? (
            <>
              {isAdmin() && (
                <span onClick={() => navigate('/admin')}
                  style={{ fontSize: 13, color: '#C4583A', fontWeight: 500, cursor: 'pointer' }}>
                  Dashboard 👑
                </span>
              )}
              <span onClick={logout} style={{ fontSize: 13, color: '#887A6C', cursor: 'pointer' }}>Logout</span>
            </>
          ) : (
            <>
              <span onClick={() => navigate('/login')} style={{ fontSize: 13, color: '#887A6C', cursor: 'pointer' }}>Login</span>
              <span onClick={() => navigate('/register')} style={{
                fontSize: 13, color: 'white', fontWeight: 500, cursor: 'pointer',
                background: '#C4583A', padding: '7px 16px', borderRadius: 980,
              }}>Register</span>
            </>
          )}
          <div onClick={() => navigate('/cart')} style={{ position: 'relative', cursor: 'pointer' }}>
            <span style={{ fontSize: 20 }}>🛒</span>
            {cartCount > 0 && (
              <span style={{
                position: 'absolute', top: -6, right: -8,
                background: '#C4583A', color: 'white', fontSize: 10,
                borderRadius: '50%', width: 18, height: 18,
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600,
              }}>{cartCount}</span>
            )}
          </div>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{
        minHeight: '100vh', paddingTop: 52,
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        background: '#FAFAF7', textAlign: 'center', padding: '120px 48px 80px',
      }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C4583A', marginBottom: 20 }}>
          Telangana · Homemade · Ships across India
        </motion.div>

        <motion.h1 className="fraunces"
          initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(48px,7vw,96px)', fontWeight: 200, lineHeight: 1.02, letterSpacing: '-0.03em', color: '#1A1008', marginBottom: 24, maxWidth: 900 }}>
          Made in Amma's kitchen.<br />
          <em style={{ fontStyle: 'italic', color: '#C4583A' }}>Delivered to yours.</em>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 18, fontWeight: 300, color: '#887A6C', lineHeight: 1.75, maxWidth: 500, marginBottom: 48 }}>
          Small-batch pickles, podulu, snacks and sweets — made the old way, shipped anywhere in India.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
            style={{ background: '#C4583A', color: 'white', fontSize: 15, fontWeight: 500, padding: '14px 32px', borderRadius: 980, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(196,88,58,0.35)', transition: 'transform 0.2s, box-shadow 0.2s' }}
            onMouseEnter={e => { e.target.style.transform = 'scale(1.04)'; e.target.style.boxShadow = '0 8px 36px rgba(196,88,58,0.45)' }}
            onMouseLeave={e => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 24px rgba(196,88,58,0.35)' }}>
            Shop this week's batch
          </button>
          <button
            style={{ background: 'transparent', color: '#1A1008', fontSize: 15, fontWeight: 400, padding: '14px 32px', borderRadius: 980, border: '1px solid #E5DDD0', cursor: 'pointer', transition: 'border-color 0.2s' }}
            onMouseEnter={e => e.target.style.borderColor = '#1A1008'}
            onMouseLeave={e => e.target.style.borderColor = '#E5DDD0'}>
            Read her story →
          </button>
        </motion.div>

        {/* trust strip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.5 }}
          style={{ display: 'flex', gap: 48, marginTop: 72, paddingTop: 48, borderTop: '0.5px solid #E5DDD0' }}>
          {[
            { n: '40+', l: 'Years of recipes' },
            { n: '0', l: 'Preservatives' },
            { n: '24h', l: 'Ships next day' },
            { n: '₹0', l: 'Commission' },
          ].map(s => (
            <div key={s.n} style={{ textAlign: 'center' }}>
              <div className="fraunces" style={{ fontSize: 28, fontWeight: 300, color: '#1A1008', letterSpacing: '-0.02em' }}>{s.n}</div>
              <div style={{ fontSize: 12, color: '#887A6C', marginTop: 4, letterSpacing: '0.04em' }}>{s.l}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ── STORY BAND ── */}
      <section style={{ background: '#1A1008', padding: '100px 48px', textAlign: 'center' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}>
          <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.35)', marginBottom: 24 }}>
            Warangal, Telangana · Since 1984
          </div>
          <h2 className="fraunces" style={{ fontSize: 'clamp(32px,5vw,64px)', fontWeight: 200, lineHeight: 1.08, letterSpacing: '-0.03em', color: '#FAFAF7', maxWidth: 800, margin: '0 auto 24px' }}>
            Forty years of recipes<br />that were never{' '}
            <em style={{ fontStyle: 'italic', color: '#D97455' }}>written down.</em>
          </h2>
          <p style={{ fontSize: 17, fontWeight: 300, color: 'rgba(250,250,247,0.45)', lineHeight: 1.75, maxWidth: 520, margin: '0 auto' }}>
            Lakshmi learned by watching. Her hands remembered what her mother's did. Every jar she makes today carries that memory — unchanged, uncompromised, unmistakeable.
          </p>
        </motion.div>
      </section>

      {/* ── SHOP ── */}
      <section id="shop" style={{ background: '#FAFAF7', padding: '120px 48px' }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>

          {/* header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
            style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 48 }}>
            <div>
              <div style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#887A6C', marginBottom: 10 }}>This week's batch</div>
              <h2 className="fraunces" style={{ fontSize: 'clamp(28px,3.5vw,44px)', fontWeight: 200, letterSpacing: '-0.02em', color: '#1A1008', lineHeight: 1.1 }}>
                Not just food.<br /><em style={{ color: '#C4583A' }}>A piece of Telangana.</em>
              </h2>
            </div>
            <span style={{ fontSize: 13, color: '#C4583A', fontWeight: 500, cursor: 'pointer' }}>View all →</span>
          </motion.div>

          {/* category chips */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 48, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategory(cat)} style={{
                padding: '8px 20px', borderRadius: 980, fontSize: 13,
                background: category === cat ? '#1A1008' : 'transparent',
                color: category === cat ? '#FAFAF7' : '#887A6C',
                border: category === cat ? '1px solid #1A1008' : '1px solid #E5DDD0',
                cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'Inter,sans-serif',
              }}>{CAT_LABEL[cat]}</button>
            ))}
          </div>

          {/* grid */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#887A6C', fontSize: 16 }}>
              Loading Amma's kitchen...
            </div>
          ) : filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#887A6C', fontSize: 16 }}>
              No items in this category yet 🫙
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
              {filtered.map((dish, i) => (
                <motion.div key={dish.id}
                  initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.7, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    background: '#FFFFFF',
                    borderRadius: i === 0 ? '20px 0 0 20px' : i === filtered.length - 1 ? '0 20px 20px 0' : 0,
                    overflow: 'hidden', cursor: 'pointer',
                    transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1), box-shadow 0.4s',
                  }}
                  whileHover={{ y: -8, boxShadow: '0 24px 56px rgba(26,16,8,0.1)', zIndex: 2 }}>

                  {/* image */}
                  <div style={{
                    height: 260, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 72, position: 'relative',
                    background: dish.category === 'PICKLES' ? 'linear-gradient(145deg,#2A1408,#5A3020)' :
                      dish.category === 'PODULU' ? 'linear-gradient(145deg,#0A1E0A,#1A3A1A)' :
                      dish.category === 'SNACKS' ? 'linear-gradient(145deg,#1E1208,#3A2810)' :
                      'linear-gradient(145deg,#200808,#401010)',
                  }}>
                    {CAT_EMOJI[dish.category] || '🫙'}
                    <div style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(250,250,247,0.12)', backdropFilter: 'blur(8px)', border: '0.5px solid rgba(250,250,247,0.2)', color: 'rgba(250,250,247,0.8)', fontSize: 10, padding: '4px 12px', borderRadius: 100, letterSpacing: '0.04em' }}>
                      In stock
                    </div>
                  </div>

                  {/* body */}
                  <div style={{ padding: '28px 28px 32px' }}>
                    <div style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#C4583A', marginBottom: 8, fontWeight: 500 }}>{dish.category}</div>
                    <div className="fraunces" style={{ fontSize: 22, fontWeight: 300, color: '#1A1008', marginBottom: 10, letterSpacing: '-0.01em' }}>{dish.name}</div>
                    <p style={{ fontSize: 13, lineHeight: 1.8, color: '#887A6C', marginBottom: 24, fontWeight: 300 }}>{dish.description}</p>

                    {/* color dots */}
                    <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
                      {['#C4583A', '#3A7A3A', '#4A4A8A'].map((c, ci) => (
                        <div key={ci} style={{ width: 12, height: 12, borderRadius: '50%', background: c, border: ci === 0 ? '2px solid #1A1008' : '2px solid transparent', cursor: 'pointer' }} />
                      ))}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div className="fraunces" style={{ fontSize: 26, fontWeight: 300, color: '#1A1008' }}>
                        ₹{dish.price}
                        <span style={{ fontSize: 12, fontFamily: 'Inter,sans-serif', color: '#887A6C', marginLeft: 4 }}>/ 250g</span>
                      </div>
                      <button
                        onClick={() => addToCart(dish)}
                        style={{
                          fontSize: 13, fontWeight: 500, fontFamily: 'Inter,sans-serif',
                          color: addedId === dish.id ? 'white' : '#C4583A',
                          background: addedId === dish.id ? '#4A7A4C' : 'transparent',
                          border: addedId === dish.id ? '1px solid #4A7A4C' : '1px solid #C4583A',
                          padding: '8px 20px', borderRadius: 980, cursor: 'pointer',
                          transition: 'all 0.25s',
                        }}>
                        {addedId === dish.id ? '✓ Added' : 'Add to cart'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── QUOTE ── */}
      <section style={{ background: '#C4583A', padding: '100px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <motion.blockquote className="fraunces"
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(24px,4vw,52px)', fontWeight: 200, fontStyle: 'italic', lineHeight: 1.18, letterSpacing: '-0.02em', color: 'white', maxWidth: 740, margin: '0 auto 20px' }}>
          "I don't measure.<br />I know when it's right."
        </motion.blockquote>
        <motion.cite
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
          — Lakshmi Polsani · Warangal, Telangana
        </motion.cite>
      </section>

      {/* ── FEATURES ── */}
      <section style={{ background: '#F4F0E8', padding: '120px 48px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
            style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#C4583A', marginBottom: 14 }}>
            Why Lakshmi Home Foods
          </motion.div>
          <motion.h2 className="fraunces"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.8, delay: 0.1 }}
            style={{ fontSize: 'clamp(26px,3.5vw,44px)', fontWeight: 200, letterSpacing: '-0.02em', color: '#1A1008', marginBottom: 64, maxWidth: 420, lineHeight: 1.12 }}>
            Made like it matters.<br />Because it <em>does.</em>
          </motion.h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 44 }}>
            {[
              { icon: '🌿', title: 'No preservatives', desc: 'Salt, oil and time. The way it has always been.' },
              { icon: '📦', title: 'Made to order', desc: 'Your order triggers the batch. Freshness is the process.' },
              { icon: '🚚', title: 'Ships in 24 hours', desc: 'Tracked courier to your door, anywhere in India.' },
              { icon: '📅', title: '3–6 months shelf life', desc: 'No refrigeration needed. Arrives the way it left.' },
            ].map((f, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7, delay: i * 0.1 }}
                style={{ borderTop: '0.5px solid #DDD0B8', paddingTop: 24 }}>
                <div style={{ fontSize: 22, marginBottom: 16 }}>{f.icon}</div>
                <div className="fraunces" style={{ fontSize: 17, fontWeight: 300, color: '#1A1008', marginBottom: 10 }}>{f.title}</div>
                <p style={{ fontSize: 13, lineHeight: 1.85, color: '#887A6C', fontWeight: 300 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{ background: '#1A1008', padding: '140px 48px', textAlign: 'center' }}>
        <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.7 }}
          style={{ fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(250,250,247,0.2)', marginBottom: 18 }}>
          Ready?
        </motion.div>
        <motion.h2 className="fraunces"
          initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.3 }} transition={{ duration: 0.9, delay: 0.1 }}
          style={{ fontSize: 'clamp(32px,5.5vw,68px)', fontWeight: 200, lineHeight: 1.05, letterSpacing: '-0.03em', color: '#FAFAF7', marginBottom: 16 }}>
          Taste what forty years<br />of practice <em style={{ color: '#D97455' }}>tastes like.</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.2 }}
          style={{ fontSize: 15, color: 'rgba(250,250,247,0.25)', marginBottom: 40, fontWeight: 300 }}>
          Small batch · No preservatives · Ships pan-India
        </motion.p>
        <motion.button
          initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.3 }}
          whileHover={{ scale: 1.04, boxShadow: '0 12px 44px rgba(196,88,58,0.5)' }}
          onClick={() => document.getElementById('shop').scrollIntoView({ behavior: 'smooth' })}
          style={{ background: '#C4583A', color: 'white', fontSize: 15, fontWeight: 500, padding: '16px 36px', borderRadius: 980, border: 'none', cursor: 'pointer', boxShadow: '0 4px 28px rgba(196,88,58,0.35)', fontFamily: 'Inter,sans-serif' }}>
          Shop this week's batch →
        </motion.button>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ background: '#F4F0E8', borderTop: '0.5px solid #DDD0B8', padding: '52px 48px 40px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 52, paddingBottom: 44, borderBottom: '0.5px solid #DDD0B8', marginBottom: 32 }}>
            <div>
              <div className="fraunces" style={{ fontSize: 16, fontWeight: 300, color: '#1A1008', marginBottom: 12 }}>Lakshmi Home Foods</div>
              <p style={{ fontSize: 13, lineHeight: 1.8, color: '#887A6C', maxWidth: 220, fontWeight: 300 }}>Homemade Telangana flavors. Small batches. Shipped across India. One kitchen. Forty years.</p>
            </div>
            {[
              { title: 'Shop', links: ['Pickles', 'Podulu', 'Snacks', 'Sweets'] },
              { title: 'Story', links: ['Our story', 'The kitchen', "How it's made", 'Contact'] },
              { title: 'Orders', links: ['Track order', 'Shipping info', 'Returns', 'FAQ'] },
            ].map(col => (
              <div key={col.title}>
                <h5 style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(26,16,8,0.28)', marginBottom: 16 }}>{col.title}</h5>
                {col.links.map(l => (
                  <div key={l} style={{ fontSize: 13, color: '#887A6C', marginBottom: 11, fontWeight: 300, cursor: 'pointer' }}>{l}</div>
                ))}
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'rgba(136,122,108,0.5)' }}>
            <span>© 2026 Lakshmi Home Foods</span>
            <span>Made with love in Amma's kitchen · Hyderabad, Telangana</span>
          </div>
        </div>
      </footer>
    </div>
  )
}