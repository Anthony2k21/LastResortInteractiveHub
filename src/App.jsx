import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './firebase';
import DrinkLeaderboard from './DrinkLeaderboard';
import AdminLogin from './AdminLogin';
import AdminPanel from './AdminPanel';
import HomePage from './HomePage';
import DrinkSuggestionsPage from './Drink_Suggestions_Page';
import SuggestionsPage from './SuggestionsPage';

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

  return <HomePage />;
}

export default App;