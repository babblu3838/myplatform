'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

function generateCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function CirclesPage() {
  const [view, setView] = useState<'home' | 'create' | 'join'>('home')
  const [circleName, setCircleName] = useState('')
  const [username, setUsername] = useState('')
  const [inviteCode, setInviteCode] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [done, setDone] = useState('')

  async function createCircle() {
    if (!circleName || !username) return
    const code = generateCode()
    const { data, error } = await supabase
      .from('circles')
      .insert({ name: circleName, invite_code: code, created_by: username })
      .select()
    if (error) { alert('Something went wrong'); return }
    await supabase.from('circle_members').insert({ circle_id: data[0].id, username })
    setInviteCode(code)
    setDone('created')
  }

  async function joinCircle() {
    if (!joinCode || !username) return
    const { data: circles } = await supabase.from('circles').select('*').eq('invite_code', joinCode.toUpperCase())
    if (!circles || circles.length === 0) { alert('Circle not found!'); return }
    const { data: members } = await supabase.from('circle_members').select('*').eq('circle_id', circles[0].id)
    if (members && members.length >= 8) { alert('This circle is full!'); return }
    await supabase.from('circle_members').insert({ circle_id: circles[0].id, username })
    window.location.href = `/circle-room/${circles[0].id}`
  }

  if (done === 'created') return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '8px' }}>Circle created! 🎉</h1>
      <p style={{ color: '#666', marginBottom: '20px' }}>Share this link with your friends — they just open it and join!</p>
      <div style={{ background: '#f5f5f5', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <div style={{ fontSize: '12px', color: '#999', marginBottom: '8px' }}>Your shareable link:</div>
        <div style={{ fontSize: '14px', fontWeight: '500', wordBreak: 'break-all', color: '#000', marginBottom: '12px' }}>
          {typeof window !== 'undefined' ? window.location.origin : ''}/join/{inviteCode}
        </div>
        <button
          onClick={() => navigator.clipboard.writeText(`${window.location.origin}/join/${inviteCode}`)}
          style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
        >
          Copy link
        </button>
      </div>
      <a href={`/circle-room/${inviteCode}`} style={{ display: 'inline-block', padding: '12px 24px', background: '#000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontSize: '14px' }}>
        Enter your circle →
      </a>
    </main>
  )

  return (
    <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <a href="/" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>← Home</a>
      <h1 style={{ fontSize: '24px', fontWeight: '500', margin: '16px 0 8px' }}>Your circles</h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '14px' }}>Small private groups of 3–8 people.</p>

      {view === 'home' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <button onClick={() => setView('create')} style={{ padding: '16px', background: '#000', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>Create a new circle →</button>
          <button onClick={() => setView('join')} style={{ padding: '16px', background: '#fff', color: '#000', border: '1px solid #ddd', borderRadius: '10px', fontSize: '15px', cursor: 'pointer', textAlign: 'left' }}>Join with invite code →</button>
        </div>
      )}

      {view === 'create' && (
        <div>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '14px', marginBottom: '20px', padding: 0 }}>← Back</button>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px' }}>Create a circle</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Circle name</label>
            <input type="text" value={circleName} onChange={e => setCircleName(e.target.value)} placeholder="e.g. Close friends" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Your name</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <button onClick={createCircle} style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>Create circle</button>
        </div>
      )}

      {view === 'join' && (
        <div>
          <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666', fontSize: '14px', marginBottom: '20px', padding: 0 }}>← Back</button>
          <h2 style={{ fontSize: '18px', fontWeight: '500', marginBottom: '20px' }}>Join a circle</h2>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Your name</label>
            <input type="text" value={username} onChange={e => setUsername(e.target.value)} placeholder="Your name" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>Invite code</label>
            <input type="text" value={joinCode} onChange={e => setJoinCode(e.target.value)} placeholder="Enter 6-letter code" style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', textTransform: 'uppercase' }} />
          </div>
          <button onClick={joinCircle} style={{ padding: '12px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', cursor: 'pointer' }}>Join circle</button>
        </div>
      )}
    </main>
  )
}