'use client'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
            fontFamily: 'system-ui, sans-serif',
            backgroundColor: '#f8fafc',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '28rem' }}>
            <h1
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#0f172a',
                marginBottom: '0.5rem',
              }}
            >
              Something went wrong
            </h1>
            <p
              style={{
                color: '#64748b',
                marginBottom: '1.5rem',
              }}
            >
              An unexpected error occurred. Please try again.
            </p>
            <button
              onClick={() => reset()}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              Try again
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
