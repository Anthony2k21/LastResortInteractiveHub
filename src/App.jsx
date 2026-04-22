import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import DrinkLeaderboard from './DrinkLeaderboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';

function App() {
  const [hash, setHash] = useState(window.location.hash);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Update the hash state whenever the URL hash changes
  useEffect(() => {
    const handleHash = () => setHash(window.location.hash);
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // fires immediately and whenever auth state changes, sets user and loading state
  useEffect(() => {
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthLoading(false);
    });
  }, []);

  // If the URL hash is #admin, show the admin panel or login, otherwise show the leaderboard
  if (hash === '#admin') {
    if (authLoading) return null;
    return user ? <AdminPanel user={user} /> : <AdminLogin />;
  }

  return <DrinkLeaderboard />;
}

export default App;
