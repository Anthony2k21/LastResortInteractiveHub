import { useState, useEffect } from "react";
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from './firebase';
import './styles/DrinkSuggestionsPage.css';

export default function DrinkSuggestionsPage() {
  const [drinks, setDrinks] = useState([]);
  const [suggestion, setSuggestion] = useState(null);
  const [animateBtn, setAnimateBtn] = useState(false);

  useEffect(() => {
    return onSnapshot(collection(db, 'suggestionDrinks'), snap =>
      setDrinks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  const getSuggestion = () => {
    setAnimateBtn(true);
    setSuggestion(drinks[Math.floor(Math.random() * drinks.length)]);
    setTimeout(() => setAnimateBtn(false), 250);
  };

  return (
    <>
      <div className="ds-bg" />
      <div className="ds-wrapper">

        <div className="ds-header">
          <h1 className="ds-title">Drink <span>Selector</span></h1>
          <p className="ds-subtitle">Can't decide? Let us pick your drink</p>
        </div>

        <div className="ds-card">
          <div className="ds-content">
            <div className="ds-left">
              <button
                className={`ds-button${animateBtn ? ' animate' : ''}`}
                onClick={getSuggestion}
              >
                Pick a drink
              </button>
              {suggestion && (
                <div className="ds-result">{suggestion.name}</div>
              )}
            </div>
            <div className="ds-image-wrap">
              {suggestion
                ? <img src={suggestion.img} alt={suggestion.name} className="ds-img" />
                : <div className="ds-placeholder">🍺</div>}
            </div>
          </div>
        </div>

        <a className="feat-back" href="#home">← Back Home</a>

      </div>
    </>
  );
}