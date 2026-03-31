export default function Home() {
  return (
    <main style={{
      maxWidth: '600px',
      margin: '0 auto',
      padding: '40px 20px',
      fontFamily: 'sans-serif'
    }}>
      <h1 style={{ fontSize: '28px', fontWeight: '500' }}>
        Real conversations. No pressure.
      </h1>
      <p style={{ color: '#666', marginTop: '10px', fontSize: '16px' }}>
        Ask questions. Solve problems. No likes, no followers, no stress.
      </p>
      <a href="/feed" style={{
        display: 'inline-block',
        marginTop: '24px',
        padding: '12px 24px',
        background: '#000',
        color: '#fff',
        borderRadius: '8px',
        textDecoration: 'none',
        fontSize: '15px'
      }}>
        See all conversations →
      </a>
    </main>
  )
}