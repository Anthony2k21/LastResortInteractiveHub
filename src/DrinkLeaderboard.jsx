import { useState, useEffect } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
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
    background-color: var(--colour-background);
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: var(--colour-text);
    padding: 40px 20px;
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
  }

  .lb-header h1 span {
    color: var(--colour-accent);
  }

  .lb-header p {
    color: #aaaaaa;
    margin-top: 8px;
    font-size: 0.95rem;
    font-weight: 400;
  }

  .lb-filters {
    display: flex;
    justify-content: center;
    gap: 10px;
    flex-wrap: wrap;
    margin-bottom: 32px;
  }

  .lb-filter-btn {
    background: var(--colour-surface);
    color: var(--colour-text);
    border: 1px solid #333;
    padding: 8px 20px;
    border-radius: 4px;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    transition: background 0.2s, border-color 0.2s, color 0.2s;
  }

  .lb-filter-btn:hover,
  .lb-filter-btn.active {
    background: var(--colour-primary);
    border-color: var(--colour-primary);
    color: var(--colour-text);
  }

  .lb-filter-btn:focus {
    outline: 2px solid var(--colour-accent);
    outline-offset: 2px;
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


const CATEGORIES = ['All', 'Signature', 'Cocktail', 'Craft Beer', 'Classic'];

const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function DrinkLeaderboard() {
  const [activeCategory, setActiveCategory] = useState('All');
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

  // Filter drinks based on active category
  const filtered = activeCategory === 'All'
    ? drinks
    : drinks.filter(d => d.category === activeCategory);

  const maxVotes = filtered[0]?.votes ?? 1;

  return (
    <>
      <style>{styles}</style>
      <div className="lb-wrapper">
        <header className="lb-header">
          <h1>Drink <span>Leaderboard</span></h1>
          <p>Your Last Resort — voted by the regulars</p>
        </header>

        <nav className="lb-filters" aria-label="Filter by category">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`lb-filter-btn${activeCategory === cat ? ' active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </nav>

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
              {filtered.map((drink, i) => {
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
                      <div className="drink-category">{drink.category}</div>
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
