import LightingControl from './LightingControl';
import './styles/LightingPage.css';

export default function LightingPage() {
  return (
    <>
      <div className="lp-bg" />
      <div className="lp-wrapper">
        <h1 className="lp-title">Venue <span>Lighting</span></h1>
        <p className="lp-subtitle">Set the atmosphere</p>
        <LightingControl />
        <a className="lp-back" href="#home">← Back Home</a>
      </div>
    </>
  );
}
