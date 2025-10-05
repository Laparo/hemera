export default function HomePage() {
  return (
    <div
      style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '4rem 2rem',
        textAlign: 'center',
      }}
    >
      <h1
        style={{
          fontSize: '3rem',
          marginBottom: '1rem',
          color: '#333',
        }}
      >
        Welcome to Hemera Academy
      </h1>
      <p
        style={{
          fontSize: '1.25rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto 3rem',
        }}
      >
        Transform your career with expert-led courses in technology, business,
        and creative skills.
      </p>

      <div
        style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          marginBottom: '4rem',
        }}
      >
        <button
          style={{
            background: '#0B5FFF',
            color: 'white',
            border: 'none',
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Browse Courses
        </button>
        <button
          style={{
            background: 'transparent',
            color: '#0B5FFF',
            border: '2px solid #0B5FFF',
            padding: '1rem 2rem',
            fontSize: '1rem',
            borderRadius: '8px',
            cursor: 'pointer',
          }}
        >
          Learn More
        </button>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '4rem',
        }}
      >
        <div
          style={{
            padding: '2rem',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            backgroundColor: 'white',
          }}
        >
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>
            Expert Instructors
          </h3>
          <p style={{ color: '#666' }}>
            Learn from industry professionals with years of real-world
            experience.
          </p>
        </div>
        <div
          style={{
            padding: '2rem',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            backgroundColor: 'white',
          }}
        >
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>
            Flexible Learning
          </h3>
          <p style={{ color: '#666' }}>
            Study at your own pace with lifetime access to course materials.
          </p>
        </div>
        <div
          style={{
            padding: '2rem',
            border: '1px solid #e1e5e9',
            borderRadius: '8px',
            backgroundColor: 'white',
          }}
        >
          <h3 style={{ marginBottom: '1rem', color: '#333' }}>Career Growth</h3>
          <p style={{ color: '#666' }}>
            Gain practical skills that directly apply to your career
            advancement.
          </p>
        </div>
      </div>
    </div>
  );
}
