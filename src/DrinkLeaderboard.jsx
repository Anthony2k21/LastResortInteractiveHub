import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
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

  .lb-wrapper {
    background: url('/bg.jpg') no-repeat center center / cover;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--colour-text);
    padding: 40px 20px;
    position: relative;
  }

  .lb-wrapper::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.78);
    z-index: 0;
  }

  .lb-wrapper > * {
    position: relative;
    z-index: 1;
  }

  .lb-header {
    text-align: center;
    margin-bottom: 40px;
  }

  .lb-header h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    font-weight: 800;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    background: linear-gradient(180deg, #e8353a 0%, #F69A2C 55%, #f5c518 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lb-header h1 span {
    background: inherit;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .lb-header p {
    color: #aaaaaa;
    margin-top: 8px;
    font-size: 0.95rem;
    font-weight: 400;
  }

  .lb-table-container {
    max-width: 860px;
    margin: 0 auto;
    background: var(--colour-surface);
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #2a2a2a;
  }

  .lb-table {
    width: 100%;
    border-collapse: collapse;
  }

  .lb-table thead {
    background: var(--colour-primary);
  }

  .lb-table thead th {
    padding: 14px 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: left;
    color: var(--colour-text);
  }

  .lb-table thead th.right {
    text-align: right;
  }

  .lb-table tbody tr {
    border-bottom: 1px solid #2a2a2a;
    transition: background 0.15s;
  }

  .lb-table tbody tr:last-child {
    border-bottom: none;
  }

  .lb-table tbody tr:hover {
    background: #242424;
  }

  .lb-table td {
    padding: 14px 20px;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--colour-text);
  }

  .lb-table td.right {
    text-align: right;
    font-weight: 600;
  }

  .rank-cell {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 50px;
  }

  .rank-number {
    font-size: 0.85rem;
    font-weight: 700;
    color: #888;
    width: 22px;
    text-align: center;
  }

  .rank-medal {
    font-size: 1.2rem;
    width: 22px;
    text-align: center;
  }

  .drink-name {
    font-weight: 600;
  }

  .drink-category {
    font-size: 0.78rem;
    color: #888;
    margin-top: 2px;
  }

  .votes-bar-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .votes-bar-bg {
    flex: 1;
    height: 6px;
    background: #333;
    border-radius: 3px;
    min-width: 80px;
  }

  .votes-bar-fill {
    height: 6px;
    border-radius: 3px;
    background: var(--colour-primary);
    transition: width 0.4s ease;
  }

  .votes-bar-fill.top {
    background: var(--colour-accent);
  }

  .votes-count {
    font-size: 0.85rem;
    color: #aaa;
    min-width: 30px;
    text-align: right;
  }

  .price-tag {
    color: var(--colour-accent);
    font-weight: 700;
  }

  .badge-new {
    display: inline-block;
    background: var(--colour-accent);
    color: #000;
    font-size: 0.65rem;
    font-weight: 800;
    padding: 2px 6px;
    border-radius: 3px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 8px;
    vertical-align: middle;
  }

  .lb-back {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: #888;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-weight: 600;
    cursor: pointer;
    background: none;
    border: none;
    font-family: inherit;
    max-width: 860px;
    width: 100%;
    display: block;
    margin: 0 auto 24px;
    transition: color 0.15s;
  }
  .lb-back:hover { color: #F69A2C; }

  .upvote-btn {
    background: none;
    border: 1px solid #333;
    border-radius: 4px;
    color: #888;
    cursor: pointer;
    padding: 4px 8px;
    font-size: 0.85rem;
    transition: color 0.15s, border-color 0.15s;
    line-height: 1;
  }
  .upvote-btn:hover {
    color: #F69A2C;
    border-color: #F69A2C;
  }
  .upvote-btn:active {
    transform: scale(0.92);
  }

  .lb-footer {
    text-align: center;
    margin-top: 24px;
    color: #555;
    font-size: 0.8rem;
  }

  @media (max-width: 600px) {
    .lb-table thead th.hide-mobile,
    .lb-table td.hide-mobile {
      display: none;
    }

    .lb-table td,
    .lb-table thead th {
      padding: 12px 12px;
    }
  }
`;


const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function DrinkLeaderboard() {
  const [drinks, setDrinks] = useState([]);

  // Listen to real-time updates from Firestore
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'drinks'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.votes - a.votes);
      setDrinks(data);
    });
    return unsub;
  }, []);

  const maxVotes = drinks[0]?.votes ?? 1;

  function upvote(id) {
    updateDoc(doc(db, 'drinks', id), { votes: increment(1) });
  }

  return (
    <>
      <style>{styles}</style>
      <div className="lb-wrapper">
        <button className="lb-back" onClick={() => { window.location.hash = ''; }}>← Back</button>
        <header className="lb-header">
          <h1>Drink <span>Leaderboard</span></h1>
          <p>Your Last Resort — voted by the regulars</p>
        </header>

        <div className="lb-table-container">
          <table className="lb-table" aria-label="Drink leaderboard">
            <thead>
              <tr>
                <th style={{ width: 50 }}>#</th>
                <th>Drink</th>
                <th className="hide-mobile">Votes</th>
                <th className="right hide-mobile">Price</th>
              </tr>
            </thead>
            <tbody>
              {drinks.map((drink, i) => {
                const rank = i + 1;
                const pct = Math.round((drink.votes / maxVotes) * 100);
                return (
                  <tr key={drink.id}>
                    <td>
                      <div className="rank-cell">
                        {MEDALS[rank]
                          ? <span className="rank-medal">{MEDALS[rank]}</span>
                          : <span className="rank-number">{rank}</span>
                        }
                      </div>
                    </td>
                    <td>
                      <div className="drink-name">
                        {drink.name}
                        {drink.isNew && <span className="badge-new">New</span>}
                      </div>
                    </td>
                    <td className="hide-mobile">
                      <div className="votes-bar-wrap">
                        <div className="votes-bar-bg">
                          <div
                            className={`votes-bar-fill${rank === 1 ? ' top' : ''}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="votes-count">{drink.votes}</span>
                      </div>
                    </td>
                    <td className="right hide-mobile">
                      <span className="price-tag">{drink.price}</span>
                    </td>
                    <td className="right">
                      <button className="upvote-btn" onClick={() => upvote(drink.id)}>▲</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="lb-footer">
          Updated live · Votes reset every 30 days ·{' '}
          <a href="#admin" style={{ color: '#333', textDecoration: 'none' }}>Admin</a>
        </p>
      </div>
    </>
  );
}
