import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const styles = `
  .hp-wrapper {
    background-color: #000000;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
  }

  .hp-logo-bar {
    width: 60px;
    height: 4px;
    background: #931D0A;
    margin: 0 auto 32px;
    border-radius: 2px;
  }

  .hp-title {
    font-size: clamp(2.6rem, 7vw, 5rem);
    font-weight: 900;
    letter-spacing: -0.03em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1;
    margin: 0 0 12px;
  }

  .hp-title span {
    color: #F69A2C;
  }

  .hp-tagline {
    color: #888888;
    font-size: 0.95rem;
    font-weight: 400;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 60px;
  }

  .hp-cards {
    display: flex;
    gap: 20px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 760px;
  }

  .hp-card {
    background: #1A1A1A;
    border: 1px solid #2a2a2a;
    border-radius: 8px;
    padding: 36px 32px;
    flex: 1 1 280px;
    max-width: 340px;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    color: inherit;
    display: block;
    transition: border-color 0.2s, background 0.2s;
    box-sizing: border-box;

    flex: 1 1 calc(50% - 20px);
    max-width: calc(50% - 20px);
  }
  
  @media (max-width: 600px) {
  .hp-card {
    flex: 1 1 100%;
    max-width: 100%;
  }
}

  .hp-card:hover {
    border-color: #931D0A;
    background: #1f1a1a;
  }

  .hp-card-icon {
    font-size: 1.8rem;
    margin-bottom: 16px;
  }

  .hp-card-title {
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
    color: #ffffff;
  }

  .hp-card-title span {
    color: #F69A2C;
  }

  .hp-card-desc {
    font-size: 0.85rem;
    color: #888;
    line-height: 1.5;
  }

  .hp-card-cta {
    display: inline-block;
    margin-top: 20px;
    font-size: 0.78rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #F69A2C;
  }

  .hp-footer {
    margin-top: 60px;
    font-size: 0.75rem;
    color: #333;
    letter-spacing: 0.05em;
    text-align: center;
  }

  .hp-footer a {
    color: #444;
    text-decoration: none;
  }

  .hp-footer a:hover {
    color: #666;
  }

  .hp-dev-note {
    margin-top: 40px;
    padding: 14px 20px;
    border: 1px dashed #931D0A;
    border-radius: 6px;
    font-size: 0.8rem;
    color: #aaa;
    text-align: center;
    max-width: 500px;
    line-height: 1.5;
  }

  .hp-dev-note strong {
    color: #F69A2C;
  }

  .hp-insta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 28px;
    text-decoration: none;
    color: #888;
    font-size: 0.82rem;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }

  .hp-insta:hover {
    color: #fff;
  }

  .hp-insta-count {
    color: #F69A2C;
    font-weight: 800;
  }
`;

export default function HomePage() {
  const [instaCount, setInstaCount] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) setInstaCount(snap.data().instagramFollowers ?? null);
    });
  }, []);

  return (
    <>
      <style>{styles}</style>
      <div className="hp-wrapper">
        <div className="hp-logo-bar" />

        <h1 className="hp-title">
          The Last <span>Resort</span>
        </h1>
        <p className="hp-tagline">Your second living room
except with draught beer
(and wine, spirits,
snacks, vibes, disco ball etc.)</p>

        <div className="hp-cards">
          <a className="hp-card" href="#leaderboard">
            <div className="hp-card-icon">🏆</div>
            <div className="hp-card-title">Drink <span>Leaderboard</span></div>
            <div className="hp-card-desc">
              See which drinks the regulars are voting for this month. Live rankings, updated in real time.
            </div>
            <span className="hp-card-cta">View rankings →</span>
          </a>

          <a className="hp-card" href="#drink_suggestion">
            <div className="hp-card-icon">🍺</div>
            <div className="hp-card-title"><span>Random Drink Suggester</span></div>
            <div className="hp-card-desc">
              Can't decide? want to try something new?
            </div>
            <span className="hp-card-cta">See whats tasty! →</span>
          </a>
          
          <a className="hp-card" href="#suggestions">
           <div className="hp-card-icon">💡</div>
           <div className="hp-card-title"><span>Suggest your ideas!</span></div>
           <div className="hp-card-desc">
           Tell us what we're missing. 
          </div>
          <span className="hp-card-cta">Start suggesting! →</span>
         </a>
                 

        </div>

        {instaCount !== null && (
          <a className="hp-insta" href="https://www.instagram.com/weareyourlastresort/" target="_blank" rel="noreferrer">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.688.072-4.947 0-3.259-.014-3.667-.072-4.947-.085-1.856-.601-3.698-1.942-5.039C20.645.673 18.803.157 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
            </svg>
            <span className="hp-insta-count">{Number(instaCount).toLocaleString()}</span> followers
          </a>
        )}

        <div className="hp-dev-note">
          <strong>Note to the group:</strong> Whoever is editing the home page — feel free to change the design, copy, or anything else you think would make it better. This is just a starting point to get us going.
        </div>

        <p className="hp-footer">
          &copy; The Last Resort &nbsp;·&nbsp;{' '}
          <a href="#home">Home</a>
        </p>
      </div>
    </>
  );
}
