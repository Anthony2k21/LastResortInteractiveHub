import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';

const styles = `
  :root {
    --colour-primary: #931D0A;
    --colour-background: #000000;
    --colour-text: #FFFFFF;
    --colour-accent: #F69A2C;
    --colour-surface: #1A1A1A;
  }

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  .sg-wrapper {
    background-color: var(--colour-background);
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--colour-text);
    padding: 40px 20px;
  }

  .sg-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .sg-header h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }

  .sg-header h1 span {
    color: var(--colour-accent);
  }

  .sg-header p {
    color: #aaaaaa;
    margin-top: 8px;
    font-size: 0.95rem;
    font-weight: 400;
  }

  .sg-form-container {
    max-width: 860px;
    margin: 0 auto 32px;
    background: var(--colour-surface);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #2a2a2a;
    padding: 32px;
  }

  .sg-form-container label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #aaa;
    margin-bottom: 10px;
  }

  .sg-textarea {
    width: 100%;
    background: #000;
    border: 1px solid #333;
    border-radius: 4px;
    color: var(--colour-text);
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.95rem;
    padding: 14px;
    resize: vertical;
    min-height: 120px;
    box-sizing: border-box;
    transition: border-color 0.2s;
  }

  .sg-textarea:focus {
    outline: none;
    border-color: var(--colour-primary);
  }

  .sg-submit {
    margin-top: 16px;
    background: var(--colour-primary);
    color: var(--colour-text);
    border: none;
    border-radius: 4px;
    padding: 12px 28px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.85rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    cursor: pointer;
    transition: background 0.2s;
  }

  .sg-submit:hover {
    background: #b02209;
  }

  .sg-submit:disabled {
    background: #333;
    cursor: not-allowed;
  }

  .sg-success {
    margin-top: 12px;
    color: var(--colour-accent);
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sg-list-container {
    max-width: 860px;
    margin: 0 auto;
    background: var(--colour-surface);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #2a2a2a;
  }

  .sg-list-header {
    background: var(--colour-primary);
    padding: 14px 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: var(--colour-text);
  }

  .sg-item {
    padding: 18px 20px;
    border-bottom: 1px solid #2a2a2a;
    font-size: 0.95rem;
    line-height: 1.5;
    color: var(--colour-text);
    transition: background 0.15s;
  }

  .sg-item:last-child {
    border-bottom: none;
  }

  .sg-item:hover {
    background: #242424;
  }

  .sg-item-time {
    font-size: 0.75rem;
    color: #555;
    margin-top: 6px;
    letter-spacing: 0.03em;
  }

  .sg-footer {
    text-align: center;
    margin-top: 24px;
    color: #555;
    font-size: 0.8rem;
  }

  .sg-footer a {
    color: #333;
    text-decoration: none;
  }

  .sg-footer a:hover {
    color: #666;
  }
`;

export default function SuggestionsPage() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // handles suggestions documents being updated
  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setSuggestions(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return unsub;
  }, []);

  // handles submissions and timestamps it
  const handleSubmit = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    await addDoc(collection(db, 'suggestions'), {
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
    setText('');
    setSubmitted(true);
    setSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <style>{styles}</style>
      <div className="sg-wrapper">
        <header className="sg-header">
          <h1>Make a <span>Suggestion</span></h1>
          <p>Got an idea? We're all ears.</p>
        </header>

        <div className="sg-form-container">
          <label htmlFor="sg-input">Your suggestion</label>
          <textarea
            id="sg-input"
            className="sg-textarea"
            value={text}
            onChange={e => setText(e.target.value)}
          />
          <button
            className="sg-submit"
            onClick={handleSubmit}
            disabled={submitting || !text.trim()}
          >
            {submitting ? 'Sending...' : 'Submit'}
          </button>
          {submitted && <p className="sg-success">✓ Suggestion submitted!</p>}
        </div>

        <div className="sg-list-container">
          <div className="sg-list-header">Recent Suggestions</div>
          {suggestions.map(s => (
            <div className="sg-item" key={s.id}>
              <div>{s.text}</div>
              <div className="sg-item-time">
                {s.createdAt?.toDate
                  ? s.createdAt.toDate().toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                      hour: '2-digit', minute: '2-digit'
                    })
                  : 'Just now'}
              </div>
            </div>
          ))}
        </div>

        <p className="sg-footer">
          <a href="#home">Home</a>
        </p>
      </div>
    </>
  );
}