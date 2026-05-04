import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import './styles/MusicPage.css';

const COOLDOWN_MS = 60000;

export default function MusicPage() {
  const [song, setSong] = useState('');
  const [artist, setArtist] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const canSubmit = song.trim().length >= 2;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    const lastSubmit = localStorage.getItem('mp_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < COOLDOWN_MS) {
      const secs = Math.ceil((COOLDOWN_MS - (Date.now() - Number(lastSubmit))) / 1000);
      setError(`Please wait ${secs}s before submitting again.`);
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await addDoc(collection(db, 'musicSuggestions'), {
        song: song.trim(),
        artist: artist.trim() || null,
        createdAt: serverTimestamp(),
      });
      localStorage.setItem('mp_last_submit', String(Date.now()));
      setSong('');
      setArtist('');
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="mp-bg" />
      <div className="mp-wrapper">

        <div className="mp-header">
          <h1 className="mp-title">Music <span>Suggestions</span></h1>
          <p className="mp-subtitle">Tell us what to play</p>
        </div>

        <div className="mp-form-container">
          <label htmlFor="mp-song">Song name</label>
          <input
            id="mp-song"
            className="mp-input"
            value={song}
            onChange={e => { setSong(e.target.value); setError(''); }}
            placeholder="e.g. Mr. Brightside"
            maxLength={100}
          />
          <label htmlFor="mp-artist">Artist (optional)</label>
          <input
            id="mp-artist"
            className="mp-input"
            value={artist}
            onChange={e => setArtist(e.target.value)}
            placeholder="e.g. The Killers"
            maxLength={100}
          />
          <button
            className="mp-submit"
            onClick={handleSubmit}
            disabled={submitting || !canSubmit}
          >
            {submitting ? 'Sending...' : 'Request Song'}
          </button>
          {error && <p className="mp-error">{error}</p>}
          {submitted && <p className="mp-success">✓ Song requested!</p>}
        </div>

        <a className="feat-back" href="#home">← Back Home</a>

      </div>
    </>
  );
}
