'use client'
import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function NewPost() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [topic, setTopic] = useState('')
  const [username, setUsername] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit() {
    if (!title || !body) return

    await supabase.from('posts').insert({
      title,
      body,
      topic,
      username: isAnonymous ? null : username,
      is_anonymous: isAnonymous
    })

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <main style={{
        maxWidth: '600px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: 'sans-serif'
      }}>
        <h1 style={{ fontSize: '24px', fontWeight: '500' }}>
          Posted successfully!
        </h1>
        <a href="/feed" style={{
          display: 'inline-block',
          marginTop: '16px',
          color: '#000',
          textDecoration: 'underline'
        }}>
          See all conversations →
        </a>
      </main>
    )
  }

  return (
    <main style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '24px' }}>
        Ask a question or share a problem
      </h1>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="What is your question?"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
          Details
        </label>
        <textarea
          value={body}
          onChange={e => setBody(e.target.value)}
          placeholder="Explain your problem in detail..."
          rows={5}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
          Topic
        </label>
        <input
          type="text"
          value={topic}
          onChange={e => setTopic(e.target.value)}
          placeholder="e.g. Career, Health, Tech"
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px'
          }}
        />
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px' }}>
          Your name
        </label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Your name"
          disabled={isAnonymous}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            fontSize: '14px',
            opacity: isAnonymous ? 0.4 : 1
          }}
        />
      </div>

      <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <input
          type="checkbox"
          id="anon"
          checked={isAnonymous}
          onChange={e => setIsAnonymous(e.target.checked)}
        />
        <label htmlFor="anon" style={{ fontSize: '14px' }}>
          Post anonymously
        </label>
      </div>

      <button
        onClick={handleSubmit}
        style={{
          padding: '12px 24px',
          background: '#000',
          color: '#fff',
          border: 'none',
          borderRadius: '8px',
          fontSize: '15px',
          cursor: 'pointer'
        }}
      >
        Post question
      </button>
    </main>
  )
}