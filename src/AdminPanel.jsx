import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

const CATEGORIES = ['Signature', 'Cocktail', 'Craft Beer', 'Classic'];

const DEMO_DRINKS = [
  { name: 'The Last Resort',  category: 'Signature',  votes: 312, price: '£9.50',  isNew: false },
  { name: 'Crimson Wreckage', category: 'Cocktail',   votes: 278, price: '£8.00',  isNew: false },
  { name: 'Bitter End',       category: 'Craft Beer', votes: 241, price: '£5.50',  isNew: false },
  { name: 'Dark Descent',     category: 'Cocktail',   votes: 199, price: '£8.50',  isNew: true  },
  { name: 'Amber Alert',      category: 'Signature',  votes: 187, price: '£9.00',  isNew: false },
  { name: 'Negroni Noir',     category: 'Classic',    votes: 165, price: '£7.50',  isNew: false },
  { name: 'Havana Collapse',  category: 'Cocktail',   votes: 143, price: '£8.00',  isNew: true  },
  { name: 'Purgatory Pale',   category: 'Craft Beer', votes: 121, price: '£5.00',  isNew: false },
  { name: 'Mezcal Oblivion',  category: 'Signature',  votes: 99,  price: '£10.00', isNew: false },
  { name: 'The Final Round',  category: 'Classic',    votes: 82,  price: '£7.00',  isNew: false },
];

const emptyForm = { name: '', category: 'Signature', votes: '', price: '£', isNew: false };

const styles = `
  .ap-wrapper {
    background: #000;
    min-height: 100vh;
    color: #fff;
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    padding: 40px 20px;
  }
  .ap-back {
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
    max-width: 900px;
    display: block;
    margin: 0 auto 24px;
    text-align: left;
    transition: color 0.15s;
  }
  .ap-back:hover { color: #F69A2C; }
  .ap-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 900px;
    margin: 0 auto 32px;
    flex-wrap: wrap;
    gap: 12px;
  }
  .ap-header h1 {
    font-size: 1.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: -0.02em;
  }
  .ap-header h1 span { color: #F69A2C; }
  .ap-header-right { display: flex; align-items: center; gap: 16px; }
  .ap-email { color: #888; font-size: 0.85rem; }
  .ap-main { max-width: 900px; margin: 0 auto; }
  .ap-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 10px;
  }
  .ap-toolbar h2 {
    font-size: 1rem;
    font-weight: 600;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }
  .ap-table-container {
    background: #1A1A1A;
    border-radius: 6px;
    overflow: hidden;
    border: 1px solid #2a2a2a;
  }
  .ap-table { width: 100%; border-collapse: collapse; }
  .ap-table thead { background: #931D0A; }
  .ap-table thead th {
    padding: 12px 16px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    text-align: left;
  }
  .ap-table tbody tr { border-bottom: 1px solid #2a2a2a; transition: background 0.15s; }
  .ap-table tbody tr:last-child { border-bottom: none; }
  .ap-table tbody tr:hover { background: #242424; }
  .ap-table td { padding: 12px 16px; font-size: 0.9rem; vertical-align: middle; }
  .ap-badge-new {
    display: inline-block;
    background: #F69A2C;
    color: #000;
    font-size: 0.6rem;
    font-weight: 800;
    padding: 2px 5px;
    border-radius: 3px;
    text-transform: uppercase;
    margin-left: 6px;
    vertical-align: middle;
  }
  .ap-cat { color: #888; font-size: 0.8rem; }
  .ap-price { color: #F69A2C; font-weight: 700; }
  .ap-actions { display: flex; gap: 8px; justify-content: flex-end; }
  .ap-empty { text-align: center; padding: 60px 20px; color: #555; }
  .ap-empty p { margin-bottom: 16px; }

  .btn {
    font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    padding: 8px 16px;
    border-radius: 4px;
    border: none;
    cursor: pointer;
    transition: opacity 0.15s;
  }
  .btn:hover { opacity: 0.85; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-primary { background: #931D0A; color: #fff; }
  .btn-accent { background: #F69A2C; color: #000; }
  .btn-ghost { background: #1A1A1A; color: #fff; border: 1px solid #333; }
  .btn-danger { background: #6b1111; color: #fff; }
  .btn-sm { padding: 5px 10px; font-size: 0.72rem; }

  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.75);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 100;
    padding: 20px;
  }
  .modal-box {
    background: #1A1A1A;
    border: 1px solid #333;
    border-radius: 8px;
    padding: 32px;
    width: 100%;
    max-width: 460px;
  }
  .modal-box h2 {
    font-size: 1.1rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 24px;
  }
  .modal-box h2 span { color: #F69A2C; }
  .form-group { margin-bottom: 16px; }
  .form-group label {
    display: block;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #aaa;
    margin-bottom: 6px;
  }
  .form-group input,
  .form-group select {
    width: 100%;
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    padding: 9px 12px;
    font-family: inherit;
    font-size: 0.9rem;
    transition: border-color 0.2s;
  }
  .form-group input:focus,
  .form-group select:focus { outline: none; border-color: #F69A2C; }
  .form-group select option { background: #111; }
  .form-checkbox {
    display: flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    font-size: 0.9rem;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #aaa;
  }
  .form-checkbox input[type="checkbox"] { width: auto; cursor: pointer; }
  .modal-footer { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
  .confirm-box { max-width: 360px; }
  .confirm-box p { color: #aaa; font-size: 0.9rem; margin-bottom: 24px; line-height: 1.5; }

  .ap-section {
    margin-top: 40px;
  }
  .ap-section-title {
    font-size: 1rem;
    font-weight: 600;
    color: #aaa;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-bottom: 16px;
  }
  .ap-insta-row {
    display: flex;
    align-items: center;
    gap: 12px;
    background: #1A1A1A;
    border: 1px solid #2a2a2a;
    border-radius: 6px;
    padding: 16px 20px;
  }
  .ap-insta-row input {
    background: #111;
    border: 1px solid #333;
    border-radius: 4px;
    color: #fff;
    padding: 8px 12px;
    font-family: inherit;
    font-size: 0.9rem;
    width: 160px;
    transition: border-color 0.2s;
  }
  .ap-insta-row input:focus { outline: none; border-color: #F69A2C; }
  .ap-insta-label { font-size: 0.82rem; color: #888; flex: 1; }
`;

export default function AdminPanel({ user }) {
  const [drinks, setDrinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [instaCount, setInstaCount] = useState('');
  const [instaSaving, setInstaSaving] = useState(false);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'drinks'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      data.sort((a, b) => b.votes - a.votes);
      setDrinks(data);
      setLoading(false);
    });
    return unsub;
  }, []);

  useEffect(() => {
    getDoc(doc(db, 'settings', 'site')).then(snap => {
      if (snap.exists()) setInstaCount(snap.data().instagramFollowers ?? '');
    });
  }, []);

  async function saveInstaCount() {
    setInstaSaving(true);
    await setDoc(doc(db, 'settings', 'site'), { instagramFollowers: Number(instaCount) }, { merge: true });
    setInstaSaving(false);
  }

  // Open the add drink modal, resets the form and error state
  function openAdd() {
    setForm(emptyForm);
    setSaveError('');
    setModal({ mode: 'add' });
  }

  // Open the edit drink modal
  function openEdit(drink) {
    setSaveError('');
    setForm({
      name: drink.name,
      category: drink.category,
      votes: drink.votes,
      price: drink.price,
      isNew: drink.isNew ?? false,
    });
    setModal({ mode: 'edit', id: drink.id });
  }

  //checks if form is valid, the creates a new drink data object and either adds it to the collection or updates the existing document, shows error if it fails, and closes the modal on success
  async function handleSave() {
    if (!form.name.trim()) return;
    setSaving(true);
    setSaveError('');
    const data = {
      name: form.name.trim(),
      category: form.category,
      votes: Number(form.votes) || 0,
      price: form.price.trim(),
      isNew: form.isNew,
    };
    try {
      if (modal.mode === 'add') {
        // Add to firestore attempted
        await addDoc(collection(db, 'drinks'), data);
      } else {
        await updateDoc(doc(db, 'drinks', modal.id), data);
      }
      setModal(null);
    } catch (err) {
      // Check if the error is a permission error and show a more user-friendly message
      setSaveError(err.code === 'permission-denied'
        ? 'Permission denied — check your Firestore security rules.'
        : err.message);
    } finally {
      //runs no matter what after try/catch, sets saving state to false to re-enable the save button
      setSaving(false);
    }
  }

  //deletes the drink document from firestore and closes the delete confirmation modal
  async function handleDelete() {
    await deleteDoc(doc(db, 'drinks', deleteTarget.id));
    setDeleteTarget(null);
  }

  
  async function seedDemoData() {
    // adds all demo drinks to firestore, sets saving state to disable the button while it's running, and re-enables it when done
    setSaving(true);
    try {
      await Promise.all(DEMO_DRINKS.map(d => addDoc(collection(db, 'drinks'), d)));
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style>{styles}</style>
      <div className="ap-wrapper">
        <button className="ap-back" onClick={() => { window.location.hash = ''; }}>
          ← Back to leaderboard
        </button>

        <div className="ap-header">
          <h1>Admin <span>Panel</span></h1>
          <div className="ap-header-right">
            <span className="ap-email">{user.email}</span>
            <button className="btn btn-ghost" onClick={() => signOut(auth)}>Sign Out</button>
          </div>
        </div>

        <div className="ap-main">
          <div className="ap-toolbar">
            <h2>{drinks.length} {drinks.length === 1 ? 'Drink' : 'Drinks'}</h2>
            <button className="btn btn-primary" onClick={openAdd}>+ Add Drink</button>
          </div>

          <div className="ap-table-container">
            {loading ? (
              <div className="ap-empty"><p>Loading…</p></div>
            ) : drinks.length === 0 ? (
              <div className="ap-empty">
                <p>No drinks yet. Add one above or load the demo data.</p>
                <button className="btn btn-accent" onClick={seedDemoData} disabled={saving}>
                  {saving ? 'Loading…' : 'Load demo drinks'}
                </button>
              </div>
            ) : (
              <table className="ap-table">
                <thead>
                  <tr>
                    <th>Drink</th>
                    <th>Category</th>
                    <th>Votes</th>
                    <th>Price</th>
                    <th style={{ textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drinks.map(drink => (
                    <tr key={drink.id}>
                      <td>
                        {drink.name}
                        {drink.isNew && <span className="ap-badge-new">New</span>}
                      </td>
                      <td><span className="ap-cat">{drink.category}</span></td>
                      <td>{drink.votes}</td>
                      <td><span className="ap-price">{drink.price}</span></td>
                      <td>
                        <div className="ap-actions">
                          <button className="btn btn-ghost btn-sm" onClick={() => openEdit(drink)}>Edit</button>
                          <button className="btn btn-danger btn-sm" onClick={() => setDeleteTarget(drink)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="ap-section">
          <div className="ap-section-title">Instagram</div>
          <div className="ap-insta-row">
            <span className="ap-insta-label">📸 Follower count shown on homepage</span>
            <input
              type="number"
              min="0"
              value={instaCount}
              onChange={e => setInstaCount(e.target.value)}
              placeholder="e.g. 1234"
            />
            <button className="btn btn-primary" onClick={saveInstaCount} disabled={instaSaving}>
              {instaSaving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>

        {modal && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setModal(null)}>
            <div className="modal-box">
              <h2>{modal.mode === 'add' ? 'Add' : 'Edit'} <span>Drink</span></h2>
              <div className="form-group">
                <label htmlFor="f-name">Name</label>
                <input
                  id="f-name"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Dark Descent"
                />
              </div>
              <div className="form-group">
                <label htmlFor="f-cat">Category</label>
                <select
                  id="f-cat"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="f-votes">Votes</label>
                <input
                  id="f-votes"
                  type="number"
                  min="0"
                  value={form.votes}
                  onChange={e => setForm(f => ({ ...f, votes: e.target.value }))}
                  placeholder="0"
                />
              </div>
              <div className="form-group">
                <label htmlFor="f-price">Price</label>
                <input
                  id="f-price"
                  value={form.price}
                  onChange={e => setForm(f => ({ ...f, price: e.target.value }))}
                  placeholder="£8.50"
                />
              </div>
              <div className="form-group">
                <label className="form-checkbox">
                  <input
                    type="checkbox"
                    checked={form.isNew}
                    onChange={e => setForm(f => ({ ...f, isNew: e.target.checked }))}
                  />
                  Mark as NEW
                </label>
              </div>
              {saveError && (
                <p style={{ color: '#ff8070', fontSize: '0.82rem', marginTop: 8 }}>{saveError}</p>
              )}
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Cancel</button>
                <button
                  className="btn btn-primary"
                  onClick={handleSave}
                  disabled={saving || !form.name.trim()}
                >
                  {saving ? 'Saving…' : modal.mode === 'add' ? 'Add Drink' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        )}

        {deleteTarget && (
          <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setDeleteTarget(null)}>
            <div className="modal-box confirm-box">
              <h2>Delete <span>Drink</span></h2>
              <p>Remove <strong style={{ color: '#fff' }}>{deleteTarget.name}</strong> from the leaderboard? This cannot be undone.</p>
              <div className="modal-footer">
                <button className="btn btn-ghost" onClick={() => setDeleteTarget(null)}>Cancel</button>
                <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
