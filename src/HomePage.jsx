import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';

const styles = `
  .hp-wrapper {
    background-color: #111;
    min-height: 100vh;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    color: #ffffff;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding: 0 0 60px;
    position: relative;
  }

  .hp-bg {
    position: fixed;
    inset: 0;
    background-image: url('/land_pic_7.b2b35a5fdbaaafabd007.jpg');
    background-size: cover;
    background-position: center top;
    z-index: 0;
  }

  .hp-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.62);
  }

  .hp-content {
    position: relative;
    z-index: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 48px 20px 60px;
  }

  .hp-logo {
    width: 170px;
    height: 170px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 20px;
  }

  .hp-title {
    font-size: clamp(2.8rem, 9vw, 5.5rem);
    font-weight: 900;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    text-align: center;
    line-height: 1.1;
    margin: 0 0 16px;
    background: linear-gradient(135deg, #ff8c00, #F69A2C, #ff6a00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hp-tagline {
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.85rem;
    font-weight: 400;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    text-align: center;
    margin-bottom: 52px;
  }

  .hp-cards {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
    justify-content: center;
    width: 100%;
    max-width: 780px;
  }

  .hp-card {
    background: rgba(20, 20, 20, 0.82);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-left: 3px solid #931D0A;
    border-radius: 8px;
    padding: 32px 28px;
    cursor: pointer;
    text-align: left;
    text-decoration: none;
    color: inherit;
    display: block;
    transition: border-color 0.2s, background 0.2s, transform 0.15s;
    box-sizing: border-box;
    flex: 1 1 calc(50% - 16px);
    max-width: calc(50% - 16px);
    backdrop-filter: blur(6px);
  }

  @media (max-width: 600px) {
    .hp-card {
      flex: 1 1 100%;
      max-width: 100%;
      padding: 24px 20px;
    }
    .hp-content { padding: 28px 16px 48px; }
    .hp-logo { width: 110px; height: 110px; margin-bottom: 14px; }
    .hp-tagline { margin-bottom: 32px; font-size: 0.78rem; }
    .hp-cards { gap: 12px; }
  }

  .hp-card:hover {
    border-left-color: #F69A2C;
    background: rgba(30, 20, 10, 0.88);
    transform: translateY(-2px);
  }

  .hp-card.lighting:hover {
    border-left-color: #F69A2C;
    background: rgba(26, 26, 10, 0.88);
  }

  .hp-card-icon {
    font-size: 1.8rem;
    margin-bottom: 14px;
  }

  .hp-card-title {
    font-size: 1rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    margin-bottom: 8px;
    color: #F69A2C;
  }

  .hp-card-desc {
    font-size: 0.85rem;
    color: rgba(255, 255, 255, 0.65);
    line-height: 1.5;
  }

  .hp-card-cta {
    display: inline-block;
    margin-top: 18px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #F69A2C;
  }

  .hp-insta {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    margin-top: 40px;
    text-decoration: none;
    color: rgba(255, 255, 255, 0.55);
    font-size: 0.85rem;
    letter-spacing: 0.05em;
    transition: color 0.2s;
  }

  .hp-insta:hover { color: #fff; }

  .hp-insta svg {
    width: 18px;
    height: 18px;
    flex-shrink: 0;
  }

  .hp-insta-count {
    color: #F69A2C;
    font-weight: 800;
  }

  .hp-insta-sub {
    display: block;
    text-align: center;
    margin-top: 8px;
    font-size: 0.78rem;
    color: rgba(255, 255, 255, 0.4);
    letter-spacing: 0.04em;
  }

  .hp-insta-sub a {
    color: #F69A2C;
    text-decoration: none;
    font-weight: 700;
  }

  .hp-footer {
    margin-top: 48px;
    font-size: 0.72rem;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 0.05em;
    text-align: center;
  }

  .hp-footer a {
    color: rgba(255, 255, 255, 0.25);
    text-decoration: none;
  }

  .hp-footer a:hover { color: rgba(255, 255, 255, 0.5); }
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

      {/* pub background — loaded from /public/land_pic_7.b2b35a5fdbaaafabd007.jpg */}
      <div className="hp-bg" />

      <div className="hp-content">

        {/* logo — loaded from /public/last resort logo.png */}
        <img
          className="hp-logo"
          src="/last resort logo.png"
          alt="The Last Resort logo"
          onError={e => { e.target.style.display = 'none'; }}
        />

        <h1 className="hp-title">The Last Resort</h1>

        <p className="hp-tagline">Your second living room · Heaton, Newcastle</p>

        <div className="hp-cards">

          <a className="hp-card" href="#leaderboard">
            <div className="hp-card-icon">🏆</div>
            <div className="hp-card-title">Drink Leaderboard</div>
            <div className="hp-card-desc">
              See which drinks the regulars are voting for this month. Live rankings, updated in real time.
            </div>
            <span className="hp-card-cta">View rankings →</span>
          </a>

          <a className="hp-card" href="#drink_suggestion">
            <div className="hp-card-icon">🍺</div>
            <div className="hp-card-title">Random Drink Suggester</div>
            <div className="hp-card-desc">
              Can't decide? Want to try something new?
            </div>
            <span className="hp-card-cta">See what's tasty! →</span>
          </a>

          <a className="hp-card" href="#suggestions">
            <div className="hp-card-icon">💬</div>
            <div className="hp-card-title">Suggest Your Ideas!</div>
            <div className="hp-card-desc">
              Tell us what we're missing.
            </div>
            <span className="hp-card-cta">Start suggesting! →</span>
          </a>

          <a className="hp-card lighting" href="#lighting">
            <div className="hp-card-icon">🔆</div>
            <div className="hp-card-title">Venue Lighting</div>
            <div className="hp-card-desc">
              Set the mood. Choose a colour preset to change the atmosphere of the bar.
            </div>
            <span className="hp-card-cta">Change the lights →</span>
          </a>

        </div>

        {instaCount !== null && (
          <>
            <a
              className="hp-insta"
              href="https://www.instagram.com/weareyourlastresort/"
              target="_blank"
              rel="noreferrer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.975.975 1.246 2.242 1.308 3.608.058 1.266.07 1.646.07 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.975.975-2.242 1.246-3.608 1.308-1.266.058-1.646.07-4.85.07s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.975-.975-1.246-2.242-1.308-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608.975-.975 2.242-1.246 3.608-1.308C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.197.157 3.355.673 2.014 2.014.673 3.355.157 5.197.072 7.053.014 8.333 0 8.741 0 12c0 3.259.014 3.667.072 4.947.085 1.856.601 3.698 1.942 5.039 1.341 1.341 3.183 1.857 5.039 1.942C8.333 23.986 8.741 24 12 24c3.259 0 3.667-.014 4.947-.072 1.856-.085 3.698-.601 5.039-1.942 1.341-1.341 1.857-3.183 1.942-5.039.058-1.28.072-1.688.072-4.947 0-3.259-.014-3.667-.072-4.947-.085-1.856-.601-3.698-1.942-5.039C20.645.673 18.803.157 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
              </svg>
              <span className="hp-insta-count">{Number(instaCount).toLocaleString()}</span> followers
            </a>
            <span className="hp-insta-sub">
              Stay in the loop —{' '}
              <a href="https://www.instagram.com/weareyourlastresort/" target="_blank" rel="noreferrer">
                follow us on Instagram
              </a>{' '}
              for events, offers &amp; good vibes.
            </span>
          </>
        )}

        <p className="hp-footer">
          &copy; The Last Resort &nbsp;·&nbsp; <a href="#admin">Admin</a>
        </p>

      </div>
    </>
  );
}