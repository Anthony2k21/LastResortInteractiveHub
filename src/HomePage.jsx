import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './styles/HomePage.css';

export default function HomePage() {
  const [instaCount, setInstaCount] = useState(null);

  useEffect(() => {
    return onSnapshot(doc(db, 'settings', 'site'), (snap) => {
      if (snap.exists()) setInstaCount(snap.data().instagramFollowers ?? null);
    });
  }, []);

  return (
    <>
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

          <a className="hp-card" href="#music">
            <div className="hp-card-icon">🎵</div>
            <div className="hp-card-title">Music Requests</div>
            <div className="hp-card-desc">
              Got a song stuck in your head? Request it and we'll get it on.
            </div>
            <span className="hp-card-cta">Request a song →</span>
          </a>

          <a className="hp-card lighting" href="#lighting">
            <div className="hp-card-icon">🔆</div>
            <div className="hp-card-title">Venue Lighting</div>
            <div className="hp-card-desc">
              Set the mood. Choose a colour preset to change the atmosphere of the bar.
            </div>
            <span className="hp-card-cta">Change the lights →</span>
          </a>

          <a className="hp-card hp-card-full" href="#suggestions">
            <div className="hp-card-icon">💬</div>
            <div className="hp-card-title">Suggest Your Ideas!</div>
            <div className="hp-card-desc">
              Tell us what we're missing.
            </div>
            <span className="hp-card-cta">Start suggesting! →</span>
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