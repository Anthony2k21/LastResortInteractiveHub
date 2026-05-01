import { useState } from 'react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .sg-bg {
    position: fixed;
    inset: 0;
    background-image: url('/land_pic_7.b2b35a5fdbaaafabd007.jpg');
    background-size: cover;
    background-position: center top;
    z-index: 0;
  }

  .sg-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
  }

  .sg-wrapper {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #fff;
    padding: 48px 20px 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .sg-header {
    text-align: center;
    margin-bottom: 36px;
  }

  .sg-title {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 8px;
    color: #fff;
  }

  .sg-title span { color: #F69A2C; }

  .sg-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .sg-form-container {
    width: 100%;
    max-width: 860px;
    background: rgba(20,20,20,0.85);
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
    padding: 32px;
    margin-bottom: 24px;
    backdrop-filter: blur(6px);
  }

  .sg-form-container label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: rgba(255,255,255,0.5);
    margin-bottom: 10px;
  }

  .sg-textarea {
    width: 100%;
    background: rgba(0,0,0,0.4);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 4px;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.95rem;
    padding: 14px;
    resize: vertical;
    min-height: 120px;
    transition: border-color 0.2s;
  }

  .sg-textarea:focus {
    outline: none;
    border-color: #931D0A;
  }

  .sg-submit {
    margin-top: 16px;
    background: #931D0A;
    color: #fff;
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

  .sg-submit:hover { background: #b02209; }
  .sg-submit:disabled { background: rgba(255,255,255,0.1); cursor: not-allowed; }

  .sg-success {
    margin-top: 12px;
    color: #F69A2C;
    font-size: 0.85rem;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .sg-list-container {
    width: 100%;
    max-width: 860px;
    background: rgba(20,20,20,0.85);
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.1);
    backdrop-filter: blur(6px);
  }

  .sg-list-header {
    background: #931D0A;
    padding: 14px 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #fff;
  }

  .sg-item {
    padding: 18px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.07);
    font-size: 0.95rem;
    line-height: 1.5;
    color: #fff;
    transition: background 0.15s;
  }

  .sg-item:last-child { border-bottom: none; }
  .sg-item:hover { background: rgba(255,255,255,0.04); }

  .sg-item-time {
    font-size: 0.75rem;
    color: rgba(255,255,255,0.3);
    margin-top: 6px;
  }

  /* consistent back button */
  .feat-back {
    display: inline-block;
    margin-top: 40px;
    color: rgba(255,255,255,0.45);
    font-size: 0.8rem;
    text-decoration: none;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    transition: color 0.15s;
  }

  .feat-back:hover { color: #F69A2C; }

  @media (max-width: 600px) {
    .sg-wrapper { padding: 24px 16px 40px; }
    .sg-header { margin-bottom: 24px; }
    .sg-form-container { padding: 20px 16px; }
    .sg-submit { width: 100%; }
  }
`;

export default function SuggestionsPage() {
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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

        <a className="feat-back" href="#home">← Back Home</a>

      </div>
    </>
  );
}