import { useState } from "react";

const styles = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .ds-bg {
    position: fixed;
    inset: 0;
    background-image: url('/land_pic_7.b2b35a5fdbaaafabd007.jpg');
    background-size: cover;
    background-position: center top;
    z-index: 0;
  }

  .ds-bg::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
  }

  .ds-wrapper {
    position: relative;
    z-index: 1;
    min-height: 100vh;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 48px 20px 60px;
  }

  .ds-header {
    text-align: center;
    margin-bottom: 32px;
  }

  .ds-title {
    font-size: clamp(2.2rem, 6vw, 3.5rem);
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: -0.02em;
    line-height: 1.1;
    margin: 0 0 8px;
    color: #fff;
  }

  .ds-title span { color: #F69A2C; }

  .ds-subtitle {
    color: rgba(255,255,255,0.5);
    font-size: 0.9rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .ds-card {
    background: rgba(20,20,20,0.85);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 12px;
    padding: 36px;
    width: 100%;
    max-width: 760px;
    backdrop-filter: blur(6px);
  }

  .ds-content {
    display: flex;
    gap: 28px;
    align-items: center;
    justify-content: space-between;
  }

  .ds-left { flex: 1; }

  .ds-button {
    background: #F69A2C;
    color: #000;
    border: none;
    border-radius: 8px;
    padding: 16px 28px;
    font-weight: 900;
    font-size: 0.95rem;
    cursor: pointer;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    box-shadow: 0 4px 0 #c77c1d;
    transition: transform 0.1s, box-shadow 0.1s;
  }

  .ds-button:active {
    transform: translateY(4px);
    box-shadow: 0 0 0 #c77c1d;
  }

  .ds-button.animate {
    animation: dsPop 0.25s ease;
  }

  @keyframes dsPop {
    0% { transform: scale(1); }
    50% { transform: scale(1.06); }
    100% { transform: scale(1); }
  }

  .ds-result {
    margin-top: 24px;
    font-size: 1.6rem;
    font-weight: 900;
    color: #fff;
    animation: dsPopIn 0.25s ease-out;
  }

  @keyframes dsPopIn {
    0% { transform: scale(0.92); opacity: 0; }
    100% { transform: scale(1); opacity: 1; }
  }

  .ds-image-wrap {
    width: 240px;
    height: 240px;
    border-radius: 12px;
    overflow: hidden;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.08);
    flex-shrink: 0;
  }

  .ds-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .ds-placeholder {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    font-size: 4rem;
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

  @media (max-width: 700px) {
    .ds-wrapper { padding: 24px 16px 40px; justify-content: flex-start; }
    .ds-header { margin-bottom: 24px; }
    .ds-card { padding: 22px 18px; }
    .ds-content { flex-direction: column-reverse; text-align: center; gap: 20px; }
    .ds-image-wrap { width: 100%; height: 200px; }
    .ds-button { width: 100%; }
    .ds-result { font-size: 1.3rem; }
  }
`;

const drinks = [
  { name: "London Thunder 🍺", img: "https://pintplease.s3.eu-west-1.amazonaws.com/post/original/post_7092510-218887532.jpg" },
  { name: "High Tide 🍺", img: "https://images.untp.beer/crop?width=640&height=640&stripmeta=true&url=https://untappd.s3.amazonaws.com/photos/2025_07_29/cefabe6c1ffb3161bff3d85fd12c0547_c_1500567857_raw.jpeg" },
  { name: "Yorkshire Bitter 🍺", img: "https://images.untp.beer/crop?width=640&height=640&stripmeta=true&url=https://untappd.s3.amazonaws.com/photos/2026_04_05/c8b9b78bd9797d0627837bef3a3fe04f_c_1560894340_raw.jpg" },
  { name: "Mango Wave 🍺", img: "https://images.untp.beer/crop?width=640&height=640&stripmeta=true&url=https://untappd.s3.amazonaws.com/photos/2026_02_26/4c08f6f70ce3038fe1d622f9ba30c8c1_c_1551928999_raw.jpg" },
  { name: "Raspberry Ripple 🍺", img: "https://d31mezlzn8sqwg.cloudfront.net/media/products/17564/20190423094746704/450x450.jpg" },
  { name: "Keller Pils 🍺", img: "https://images.squarespace-cdn.com/content/v1/5bf178d1697a98763203fc8c/1583174880697-U24IMPT6T3LBITTWFGEK/KellerPills-4+crop.jpg" },
  { name: "Cruzcampo 🍺", img: "https://dramscotland.co.uk/wp-content/uploads/2023/04/FB5D4B16-A1CF-4C40-8CEB-9A7DF84149FD.jpeg" },
  { name: "Crafty Apple 🍺", img: "https://www.docteurgabs.ch/media/1230/jaq_1974-bis.jpg?width=1920&height=640&crop=auto&scale=both&quality=80" },
  { name: "Iron Brew 🍺", img: "https://vaultcity.co.uk/cdn/shop/files/IRONBREW202412-2-24web-res-3.jpg?v=1743116422" },
  { name: "Paulaner Weiss 🍺", img: "https://www.cavedirect.com/media/catalog/product/cache/00658a5c18d5a0a6f08038a53ab1286c/w/e/weissbier_btl_3_1.jpg" },
  { name: "Guinness 🍺", img: "https://api.freelogodesign.org/assets/blog/thumb/20200309091037750guinness-glass-with-logo_1176x840.jpg?t=638355680730000000" },
  { name: "Belta Blonde 🍺", img: "https://northeastbeerreview.com/wp-content/uploads/2025/12/img_6272.jpg" },
  { name: "Tight Rope 🍺", img: "https://pbs.twimg.com/media/FqjYAu-WYAI76fJ.jpg" },
  { name: "Wanderer 🍺", img: "https://pintplease.s3.eu-west-1.amazonaws.com/post/original/post_4306165-108195920.jpeg" },
  { name: "Hazy Faced Assassin 🍺", img: "https://images.squarespace-cdn.com/content/v1/628b71937f9fde6ff6d80096/5767ff33-a489-496b-9f1d-0b5c675e21b2/9dbc4af4-d0d1-bc3e-32eb-761c23cb25c8.jpg" },
  { name: "Catch The Pigeon 🍺", img: "https://images.untp.beer/crop?width=640&height=640&stripmeta=true&url=https://untappd.s3.amazonaws.com/photos/2025_07_11/ad3e71c0c8ba3e8674662ffa75a32b38_c_1495205526_raw.jpg" },
];

export default function DrinkSuggestionsPage() {
  const [suggestion, setSuggestion] = useState(null);
  const [animateBtn, setAnimateBtn] = useState(false);

  const getSuggestion = () => {
    setAnimateBtn(true);
    setSuggestion(drinks[Math.floor(Math.random() * drinks.length)]);
    setTimeout(() => setAnimateBtn(false), 250);
  };

  return (
    <>
      <style>{styles}</style>
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