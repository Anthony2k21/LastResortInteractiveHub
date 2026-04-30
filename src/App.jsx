import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import DrinkLeaderboard from './DrinkLeaderboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import HomePage from './HomePage';

// merged imports
import DrinkSuggestionsPage from './Drink_Suggestions_Page';
import SuggestionsPage from './SuggestionsPage';
import LightingControl from './LightingControl';

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  if (hash === '#admin') {
    if (authLoading) return null;
    return user ? <AdminPanel user={user} /> : <AdminLogin />;
  }

  if (hash === '#leaderboard') {
    return <DrinkLeaderboard />;
  }

  // drink suggestions (your friend's version)
  if (hash === '#drink_suggestion') {
    return <DrinkSuggestionsPage />;
  }

  // general suggestions page (new route)
  if (hash === '#suggestions') {
    return <SuggestionsPage />;
  }

  // your lighting feature (kept and integrated)
  if (hash === '#lighting') {
    return (
      <div
        style={{
          background: '#000',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '40px 20px',
          fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
        }}
      >
        <div style={{ width: '100%', maxWidth: '560px' }}>
          <div
            style={{
              textAlign: 'center',
              marginBottom: '32px',
            }}
          >
            <h1
              style={{
                fontSize: 'clamp(2rem, 6vw, 3rem)',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '-0.02em',
                color: '#fff',
                margin: '0 0 8px',
              }}
            >
              Venue <span style={{ color: '#F69A2C' }}>Lighting</span>
            </h1>
            <p
              style={{
                color: '#666',
                fontSize: '0.85rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
              }}
            >
              Set the atmosphere
            </p>
          </div>

          <LightingControl />

          <div style={{ textAlign: 'center', marginTop: '28px' }}>
            <a
              href="#home"
              style={{
                color: '#444',
                fontSize: '0.8rem',
                textDecoration: 'none',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}
            >
              ← Back home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <HomePage />;
}

export default App;