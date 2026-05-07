import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, setDoc, getDoc, query, orderBy } from 'firebase/firestore';
import { auth, db } from './firebase';
import './styles/AdminPanel.css';

const CATEGORIES = ['Signature', 'Cocktail', 'Craft Beer', 'Classic'];

const DEMO_DRINKS = [
  { name: 'London Thunder',       category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'High Tide',            category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'Yorkshire Bitter',     category: 'Craft Beer', votes: 0, price: '£5.00', isNew: false },
  { name: 'Mango Wave',           category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'Raspberry Ripple',     category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'Keller Pils',          category: 'Craft Beer', votes: 0, price: '£5.00', isNew: false },
  { name: 'Cruzcampo',            category: 'Classic',    votes: 0, price: '£4.80', isNew: false },
  { name: 'Crafty Apple',         category: 'Classic',    votes: 0, price: '£4.80', isNew: false },
  { name: 'Iron Brew',            category: 'Craft Beer', votes: 0, price: '£5.50', isNew: true  },
  { name: 'Paulaner Weiss',       category: 'Classic',    votes: 0, price: '£5.20', isNew: false },
  { name: 'Guinness',             category: 'Classic',    votes: 0, price: '£5.00', isNew: false },
  { name: 'Belta Blonde',         category: 'Craft Beer', votes: 0, price: '£5.50', isNew: true  },
  { name: 'Tight Rope',           category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'Wanderer',             category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
  { name: 'Hazy Faced Assassin',  category: 'Craft Beer', votes: 0, price: '£5.80', isNew: false },
  { name: 'Catch The Pigeon',     category: 'Craft Beer', votes: 0, price: '£5.50', isNew: false },
];

const emptyForm = { name: '', category: 'Signature', votes: '', price: '£', isNew: false };

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
  const [inbox, setInbox] = useState([]);
  const [suggDrinks, setSuggDrinks] = useState([]);
  const [newSuggName, setNewSuggName] = useState('');
  const [newSuggImg, setNewSuggImg] = useState('');
  const [musicInbox, setMusicInbox] = useState([]);

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

  useEffect(() => {
    const q = query(collection(db, 'suggestions'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setInbox(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  useEffect(() => {
    return onSnapshot(collection(db, 'suggestionDrinks'), snap =>
      setSuggDrinks(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    );
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'musicSuggestions'), orderBy('createdAt', 'desc'));
    return onSnapshot(q, snap => setMusicInbox(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  }, []);

  async function addSuggDrink() {
    if (!newSuggName.trim() || !newSuggImg.trim()) return;
    await addDoc(collection(db, 'suggestionDrinks'), {
      name: newSuggName.trim(),
      img: newSuggImg.trim(),
    });
    setNewSuggName('');
    setNewSuggImg('');
  }

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
                    <th className="ap-hide-mobile">Category</th>
                    <th className="ap-hide-mobile">Votes</th>
                    <th className="ap-hide-mobile">Price</th>
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
                      <td className="ap-hide-mobile"><span className="ap-cat">{drink.category}</span></td>
                      <td className="ap-hide-mobile">{drink.votes}</td>
                      <td className="ap-hide-mobile"><span className="ap-price">{drink.price}</span></td>
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

        <div className="ap-section">
          <div className="ap-section-title">Random Drink Suggester ({suggDrinks.length})</div>
          <div className="ap-table-container">
            {suggDrinks.map(d => (
              <div className="ap-sd-row" key={d.id}>
                <img className="ap-sd-thumb" src={d.img} alt={d.name} onError={e => { e.target.style.opacity = 0.3; }} />
                <span className="ap-sd-name">{d.name}</span>
                <button className="btn btn-danger btn-sm" onClick={() => deleteDoc(doc(db, 'suggestionDrinks', d.id))}>Delete</button>
              </div>
            ))}
            <div className="ap-sd-add">
              <input
                placeholder="Drink name"
                value={newSuggName}
                onChange={e => setNewSuggName(e.target.value)}
              />
              <input
                placeholder="Image URL"
                value={newSuggImg}
                onChange={e => setNewSuggImg(e.target.value)}
              />
              <button
                className="btn btn-accent"
                onClick={addSuggDrink}
                disabled={!newSuggName.trim() || !newSuggImg.trim()}
              >
                + Add
              </button>
            </div>
          </div>
        </div>

        <div className="ap-section">
          <div className="ap-section-title">Suggestion Box ({inbox.length})</div>
          <div className="ap-table-container">
            {inbox.length === 0 ? (
              <div className="ap-inbox-empty">No suggestions yet.</div>
            ) : (
              inbox.map(s => (
                <div className="ap-inbox-item" key={s.id}>
                  <div>
                    <div className="ap-inbox-text">{s.text}</div>
                    <div className="ap-inbox-time">
                      {s.createdAt?.toDate
                        ? s.createdAt.toDate().toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })
                        : 'Just now'}
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoc(doc(db, 'suggestions', s.id))}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="ap-section">
          <div className="ap-section-title">Music Requests ({musicInbox.length})</div>
          <div className="ap-table-container">
            {musicInbox.length === 0 ? (
              <div className="ap-inbox-empty">No music requests yet.</div>
            ) : (
              musicInbox.map(s => (
                <div className="ap-inbox-item" key={s.id}>
                  <div>
                    <div className="ap-inbox-text">
                      🎵 {s.song}{s.artist ? ` — ${s.artist}` : ''}
                    </div>
                    <div className="ap-inbox-time">
                      {s.createdAt?.toDate
                        ? s.createdAt.toDate().toLocaleDateString('en-GB', {
                            day: 'numeric', month: 'short', year: 'numeric',
                            hour: '2-digit', minute: '2-digit'
                          })
                        : 'Just now'}
                    </div>
                  </div>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => deleteDoc(doc(db, 'musicSuggestions', s.id))}
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
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
