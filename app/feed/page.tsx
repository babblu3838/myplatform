import { supabase } from '../lib/supabase'

export default async function FeedPage() {
  const { data: posts } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })

  return (
    <main style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '24px', fontWeight: '500', marginBottom: '24px' }}>
        All conversations
      </h1>

      {posts?.map(post => (
        <div key={post.id} style={{
          border: '1px solid #eee',
          borderRadius: '10px',
          padding: '16px',
          marginBottom: '16px'
        }}>
          {post.is_solved && (
            <span style={{
              fontSize: '12px',
              background: '#e6f4ea',
              color: '#2d7a3a',
              padding: '2px 8px',
              borderRadius: '10px',
              marginBottom: '8px',
              display: 'inline-block'
            }}>Solved</span>
          )}
          <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '6px' }}>
            {post.title}
          </h2>
          <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>
            {post.body}
          </p>
          <div style={{ fontSize: '12px', color: '#999' }}>
            {post.is_anonymous ? 'Anonymous' : post.username} · {post.topic}
          </div>
        </div>
      ))}
    </main>
  )
}
