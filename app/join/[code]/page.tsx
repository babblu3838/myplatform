'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function JoinPage({ params }: { params: { code: string } }) {
  const [username, setUsername] = useState('')
  const [circle, setCircle] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [joining, setJoining] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    findCircle()
  }, [])

  async function findCircle() {
    const { data } = await supabase
      .from('circles')
      .select('*')
      .eq('invite_code', params.code.toUpperCase())
    if (data && data.length > 0) {
      setCircle(data[0])
    } else {
      setError('Circle not found. Check the link and try again.')
    }
    setLoading(false)
  }

  async function joinCircle() {
    if (!username.trim()) return
    setJoining(true)

    const { data: members } = await supabase
      .from('circle_members')
      .select('*')
      .eq('circle_id', circle.id)

    if (members && members.length >= 8) {
      setError('This circle is full! Max 8 members.')
      setJoining(false)
      return
    }

    await supabase.from('circle_members').insert({
      circle_id: circle.id,
      username: username.trim()
    })

    window.location.href = `/circle-room/${circle.id}`
  }

  if (loading) return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <p style={{ color: '#999' }}>Finding your circle...</p>
    </main>
  )

  if (error) return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '12px' }}>Oops!</h1>
      <p style={{ color: '#666' }}>{error}</p>
      <a href="/" style={{ display: 'inline-block', marginTop: '16px', color: '#000' }}>← Go home</a>
    </main>
  )

  return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <a href="/" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>← Home</a>

      <h1 style={{ fontSize: '24px', fontWeight: '500', margin: '16px 0 8px' }}>
        You are invited to join
      </h1>
      <div style={{
        background: '#f5f5f5',
        borderRadius: '12px',
        padding: '16px 20px',
        marginBottom: '24px'
      }}>
        <div style={{ fontSize: '20px', fontWeight: '500' }}>{circle.name}</div>
        <div style={{ fontSize: '13px', color: '#999', marginTop: '4px' }}>
          Created by {circle.created_by}
        </div>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
          Your name
        </label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && joinCircle()}
          placeholder="Enter your name"
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }}
        />
      </div>

      <button
        onClick={joinCircle}
        disabled={joining}
        style={{
          width: '100%',
          padding: '12px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          cursor: joining ? 'not-allowed' : 'pointer',
          opacity: joining ? 0.7 : 1
        }}
      >
        {joining ? 'Joining...' : 'Join circle →'}
      </button>
    </main>
  )
}