export default function Home() {
  return (
    <main style={{
      maxWidth: '500px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: '500', marginBottom: '8px' }}>
        JustChat
      </h1>
      <p style={{ color: '#666', marginBottom: '32px', fontSize: '15px' }}>
        Real conversations. Small circles. No pressure.
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <a href="/circles" style={{
          display: 'block', padding: '16px 20px', background: '#000',
          color: '#fff', borderRadius: '10px', textDecoration: 'none', fontSize: '15px'
        }}>My circles →</a>
        <a href="/feed" style={{
          display: 'block', padding: '16px 20px', background: '#fff',
          color: '#000', border: '1px solid #ddd', borderRadius: '10px',
          textDecoration: 'none', fontSize: '15px'
        }}>All conversations →</a>
        <a href="/new-post" style={{
          display: 'block', padding: '16px 20px', background: '#fff',
          color: '#000', border: '1px solid #ddd', borderRadius: '10px',
          textDecoration: 'none', fontSize: '15px'
        }}>Ask a question →</a>
      </div>
    </main>
  )
}