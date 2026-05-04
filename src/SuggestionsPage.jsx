import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';
import './styles/SuggestionsPage.css';

const MAX_CHARS = 300;
const MIN_CHARS = 10;
const COOLDOWN_MS = 60000;

export default function SuggestionsPage() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const trimmed = text.trim();
  const charCount = text.length;

  const handleChange = (e) => {
    if (e.target.value.length <= MAX_CHARS) {
      setText(e.target.value);
      setError('');
    }
  };

  const handleSubmit = async () => {
    if (trimmed.length < MIN_CHARS) {
      setError(`Please write at least ${MIN_CHARS} characters.`);
      return;
    }
    const lastSubmit = localStorage.getItem('sg_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < COOLDOWN_MS) {
      const secs = Math.ceil((COOLDOWN_MS - (Date.now() - Number(lastSubmit))) / 1000);
      setError(`Please wait ${secs}s before submitting again.`);
      return;
    }
    setSubmitting(true);
    setError('');
    await addDoc(collection(db, 'suggestions'), {
      text: trimmed,
      createdAt: serverTimestamp(),
    });
    localStorage.setItem('sg_last_submit', String(Date.now()));
    setText('');
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <div className="sg-bg" />
      <div className="sg-wrapper">

        <div className="sg-header">
          <h1 className="sg-title">Make a <span>Suggestion</span></h1>
          <p className="sg-subtitle">Got an idea? We're all ears</p>
        </div>

        <div className="sg-form-container">
          <label htmlFor="sg-input">Your suggestion</label>
          <textarea
            id="sg-input"
            className="sg-textarea"
            value={text}
            onChange={handleChange}
            placeholder="What would you like to see at The Last Resort?"
          />
          <p className={`sg-char-count${charCount >= MAX_CHARS ? ' at-limit' : charCount >= MAX_CHARS * 0.8 ? ' near-limit' : ''}`}>
            {charCount}/{MAX_CHARS}
          </p>
          <button
            className="sg-submit"
            onClick={handleSubmit}
            disabled={submitting || trimmed.length < MIN_CHARS}
          >
            {submitting ? 'Sending...' : 'Submit'}
          </button>
          {error && <p className="sg-error">{error}</p>}
          {submitted && <p className="sg-success">✓ Suggestion submitted!</p>}
        </div>

        <a className="feat-back" href="#home">← Back Home</a>

      </div>
    </>
  );
}