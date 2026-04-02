'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function CircleRoom({ params }: { params: { id: string } }) {
  const [circle, setCircle] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [replies, setReplies] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [newPost, setNewPost] = useState('')
  const [newReply, setNewReply] = useState<{[key: string]: string}>({})
  const [savedName, setSavedName] = useState('')

  useEffect(() => {
    loadCircle()
    loadPosts()
  }, [])

  async function loadCircle() {
    const { data } = await supabase
      .from('circles')
      .select('*')
      .eq('id', params.id)
    if (data && data.length > 0) setCircle(data[0])
  }

  async function loadPosts() {
    const { data } = await supabase
      .from('posts')
      .select('*')
      .eq('circle_id', params.id)
      .order('created_at', { ascending: false })
    if (data) setPosts(data)

    const { data: replyData } = await supabase
      .from('replies')
      .select('*')
      .order('created_at', { ascending: true })
    if (replyData) setReplies(replyData)
  }

  async function submitPost() {
    if (!newPost || !savedName) return
    await supabase.from('posts').insert({
      title: newPost,
      body: newPost,
      circle_id: params.id,
      username: savedName
    })
    setNewPost('')
    await loadPosts()
  }

  async function submitReply(postId: string) {
    const replyText = newReply[postId]
    if (!replyText || !savedName) return
    await supabase.from('replies').insert({
      post_id: postId,
      body: replyText,
      username: savedName
    })
    setNewReply({ ...newReply, [postId]: '' })
    await loadPosts()
  }

  if (!savedName) {
    return (
      <main style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '500', marginBottom: '16px' }}>What is your name?</h1>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter your name"
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', marginBottom: '12px' }}
        />
        <button
          onClick={() => setSavedName(username)}
          style={{ padding: '10px 24px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
        >
          Enter circle
        </button>
      </main>
    )
  }

  return (
    <main style={{ maxWidth: '600px', margin: '0 auto', padding: '24px 20px', fontFamily: 'sans-serif' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
        <a href="/" style={{ color: '#666', textDecoration: 'none', fontSize: '14px' }}>← Home</a>
        <h1 style={{ fontSize: '20px', fontWeight: '500', margin: 0 }}>
          {circle?.name || 'Circle'}
        </h1>
      </div>

      <div style={{ background: '#f9f9f9', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <textarea
          value={newPost}
          onChange={e => setNewPost(e.target.value)}
          placeholder="Share something with your circle..."
          rows={3}
          style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', resize: 'none', marginBottom: '10px' }}
        />
        <button
          onClick={submitPost}
          style={{ padding: '10px 20px', background: '#000', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', cursor: 'pointer' }}
        >
          Post
        </button>
      </div>

      {posts.length === 0 && (
        <p style={{ color: '#999', fontSize: '14px', textAlign: 'center', padding: '40px 0' }}>
          No posts yet. Be the first to share something!
        </p>
      )}

      {posts.map(post => (
        <div key={post.id} style={{ border: '1px solid #eee', borderRadius: '12px', padding: '16px', marginBottom: '16px' }}>
          <div style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>{post.username}</div>
          <div style={{ fontSize: '15px', marginBottom: '12px', color: '#222' }}>{post.body}</div>

          <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
            {replies.filter(r => r.post_id === post.id).map(reply => (
              <div key={reply.id} style={{ marginBottom: '8px', paddingLeft: '12px', borderLeft: '2px solid #eee' }}>
                <span style={{ fontSize: '12px', fontWeight: '500', color: '#666' }}>{reply.username}: </span>
                <span style={{ fontSize: '13px', color: '#333' }}>{reply.body}</span>
              </div>
            ))}

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              <input
                type="text"
                value={newReply[post.id] || ''}
                onChange={e => setNewReply({ ...newReply, [post.id]: e.target.value })}
                placeholder="Reply..."
                style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px' }}
              />
              <button
                onClick={() => submitReply(post.id)}
                style={{ padding: '8px 16px', background: '#000', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '13px', cursor: 'pointer' }}
              >
                Reply
              </button>
            </div>
          </div>
        </div>
      ))}
    </main>
  )
}