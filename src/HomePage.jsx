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
    white-space: pre-line;
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

  .hp-card.lighting:hover {
    border-color: #F69A2C;
    background: #1a1a14;
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

        <p className="hp-tagline">
          {`Your second living room
except with draught beer
(and wine, spirits,
snacks, vibes, disco ball etc.)`}
        </p>

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
              Can't decide? Want to try something new?
            </div>
            <span className="hp-card-cta">See what's tasty! →</span>
          </a>

          <a className="hp-card" href="#suggestions">
            <div className="hp-card-icon">💡</div>
            <div className="hp-card-title"><span>Suggest your ideas!</span></div>
            <div className="hp-card-desc">
              Tell us what we're missing.
            </div>
            <span className="hp-card-cta">Start suggesting! →</span>
          </a>

          <a className="hp-card lighting" href="#lighting">
            <div className="hp-card-icon">💡</div>
            <div className="hp-card-title">Venue <span>Lighting</span></div>
            <div className="hp-card-desc">
              Set the mood. Choose a colour preset to change the atmosphere of the bar.
            </div>
            <span className="hp-card-cta">Change the lights →</span>
          </a>
        </div>

        {instaCount !== null && (
          <a
            className="hp-insta"
            href="https://www.instagram.com/weareyourlastresort/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="hp-insta-count">{Number(instaCount).toLocaleString()}</span> followers
          </a>
        )}

        <div className="hp-dev-note">
          <strong>Note to the group:</strong> Whoever is editing the home page — feel free to change the design, copy, or anything else you think would make it better.
        </div>

        <p className="hp-footer">
          &copy; The Last Resort &nbsp;·&nbsp; <a href="#home">Home</a>
        </p>
      </div>
    </>
  );
}