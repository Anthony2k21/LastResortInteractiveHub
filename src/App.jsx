import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import DrinkLeaderboard from './DrinkLeaderboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import HomePage from './HomePage';
import DrinkSuggestionsPage from './Drink_Suggestions_Page';
import SuggestionsPage from './SuggestionsPage';
import LightingControl from './LightingControl';

// ── Shared styles used across all feature pages ────────────────────────────────
const pageStyles = `
  .feat-wrapper {
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    padding: 48px 20px 60px;
  }

  /* pub background shared across all pages */
  .feat-bg {
    position: fixed;
    inset: 0;
    background-image: url('/land_pic_7.b2b35a5fdbaaafabd007.jpg');
    background-size: cover;
    background-position: center top;
    z-index: 0;
  }

  .feat-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
  }

  .feat-content {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* ── consistent page title ── */
  .feat-title {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1.1;
    text-align: center;
    margin: 0 0 8px;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .feat-title span { color: #F69A2C; }

  .feat-subtitle {
    font-size: 0.9rem;
    color: rgba(255, 255, 255, 0.5);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 36px;
  }

  /* ── consistent back home button at the bottom ── */
  .feat-back {
    display: inline-block;
    margin-top: 40px;
    color: rgba(255, 255, 255, 0.45);
    font-size: 0.8rem;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.15s;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  .feat-back:hover { color: #F69A2C; }
`

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

  if (hash === '#drink_suggestion') {
    return <DrinkSuggestionsPage />;
  }

  if (hash === '#suggestions') {
    return <SuggestionsPage />;
  }

  if (hash === '#lighting') {
    return (
      <>
        <style>{pageStyles}</style>
        <div className="feat-bg" />
        <div className="feat-wrapper">
          <div className="feat-content">
            <h1 className="feat-title">Venue <span>Lighting</span></h1>
            <p className="feat-subtitle">Set the atmosphere</p>
            <LightingControl />
            <a className="feat-back" href="#home">← Back Home</a>
          </div>
        </div>
      </>
    );
  }

  return <HomePage />;
}

export default App;