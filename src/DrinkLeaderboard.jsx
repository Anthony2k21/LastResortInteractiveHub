import { useState, useEffect } from 'react';
import { collection, onSnapshot, updateDoc, doc, increment } from 'firebase/firestore';
import { db } from './firebase';
import './styles/DrinkLeaderboard.css';

const CATEGORIES = ['All', 'Signature', 'Cocktail', 'Craft Beer', 'Classic'];
const MEDALS = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function DrinkLeaderboard() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [drinks, setDrinks] = useState([]);

  // Handle voting for a drink
  async function handleVote(id) {
    await updateDoc(doc(db, 'drinks', id), { votes: increment(1) });
  }

  // Fetch drinks from firestore and sorts them by votes in descending order
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'drinks'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.votes - a.votes);
      setDrinks(data);
    });
    return unsub;
  }, []);

  const filtered = activeCategory === 'All'
    ? drinks
    : drinks.filter(d => d.category === activeCategory);

  const maxVotes = filtered[0]?.votes ?? 1;

  return (
    <>
      <div className="lb-bg" />
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
                <th>Votes</th>
                <th className="right">Price</th>
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
                          : <span className="rank-number">{rank}</span>}
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
                        <div>
                          <div className="drink-name">
                            {drink.name}
                            {drink.isNew && <span className="badge-new">New</span>}
                          </div>
                          <div className="drink-category">{drink.category}</div>
                        </div>
                        <button className="upvote-btn" onClick={() => handleVote(drink.id)}>▲</button>
                      </div>
                    </td>
                    <td>
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
                    <td className="right">
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
          <a href="#admin">Admin</a>
        </p>

        <a className="feat-back" href="#home">← Back Home</a>

      </div>
    </>
  );
}