import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';

const styles = `
  .login-wrapper {
    background: #000;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 20px;
  }
  .login-box {
    background: #1A1A1A;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 40px;
    width: 100%;
    max-width: 380px;
  }
  .login-box h1 {
    font-size: 1.6rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    color: #fff;
    margin-bottom: 8px;
  }
  .login-box h1 span { color: #F69A2C; }
  .login-subtitle { color: #888; font-size: 0.85rem; margin-bottom: 32px; }
  .login-field { margin-bottom: 16px; }
  .login-field label {
    display: block;
    font-size: 0.72rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #aaa;
    margin-bottom: 6px;
  }
  .login-field input {
    width: 100%;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    padding: 10px 12px;
    font-family: inherit;
    font-size: 0.95rem;
    transition: border-color 0.2s;
  }
  .login-field input:focus { outline: none; border-color: #F69A2C; }
  .login-error {
    background: rgba(147,29,10,0.2);
    border: 1px solid #931D0A;
    border-radius: 4px;
    color: #ff8070;
    font-size: 0.85rem;
    padding: 10px 14px;
    margin-bottom: 16px;
  }
  .login-btn {
    width: 100%;
    background: #931D0A;
    color: #fff;
    border: none;
    border-radius: 4px;
    padding: 12px;
    font-family: inherit;
    font-size: 0.9rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    cursor: pointer;
    margin-top: 8px;
    transition: opacity 0.15s;
  }
  .login-btn:hover { opacity: 0.9; }
  .login-btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .login-back {
    display: block;
    text-align: center;
    color: #555;
    font-size: 0.8rem;
    margin-top: 20px;
    text-decoration: none;
    cursor: pointer;
    transition: color 0.15s;
    background: none;
    border: none;
    font-family: inherit;
    width: 100%;
  }
  .login-back:hover { color: #aaa; }
`;

// Admin login form component
export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle form submission for admin login, stops page from reloading 
  // disables the button, asks firebase to sign in, and shows error if it fails
  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch {
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  }

  // Render the login form and updates state as you type, shows error messages, and has a back button to return to the leaderboard
  
  return (
    <>
      <style>{styles}</style>
      <div className="login-wrapper">
        <div className="login-box">
          <h1>Admin <span>Login</span></h1>
          <p className="login-subtitle">The Last Resort — staff access only</p>
          <form onSubmit={handleSubmit}>
            {error && <div className="login-error">{error}</div>}
            <div className="login-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>
            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>
          <button className="login-back" onClick={() => { window.location.hash = ''; }}>
            ← Back to leaderboard
          </button>
        </div>
      </div>
    </>
  );
}
