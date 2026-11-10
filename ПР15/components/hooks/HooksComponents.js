import React, { useState, useEffect, useContext, createContext } from 'react';
import './HooksComponents.css';

// ---------- ЗАДАНИЕ 6: useState и useEffect ----------

// 6.1 CounterWithHooks
function CounterWithHooks({ initialValue = 0 }) {
  const [count, setCount] = useState(initialValue);
  return (
    <div className="counter-widget">
      <div className="counter">{count}</div>
      <button onClick={() => setCount(c => c - 1)}>−</button>
      <button onClick={() => setCount(c => c + 1)}>+</button>
      <button onClick={() => setCount(initialValue)}>Сброс</button>
    </div>
  );
}

// 6.2 UserProfile
function UserProfile() {
  const [profile, setProfile] = useState({ name: '', email: '', bio: '' });
  const [saved, setSaved] = useState(false);

  const change = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
    setSaved(false);
  };

  const save = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <form className="user-profile" onSubmit={save}>
      <h4>Профиль</h4>
      <input name="name"  placeholder="Имя"   value={profile.name}  onChange={change} />
      <input name="email" placeholder="Email" value={profile.email} onChange={change} />
      <textarea name="bio" placeholder="О себе" value={profile.bio} onChange={change} />
      <button type="submit">Сохранить</button>
      {saved && <span className="form-success">Сохранено!</span>}
    </form>
  );
}

// 6.3 EffectDemo
function EffectDemo() {
  const [count, setCount] = useState(0);
  const [log, setLog] = useState([]);

  // 1) запускается после каждого рендера
  useEffect(() => {
    console.log('EffectDemo: любой рендер, count =', count);
  });

  // 2) запускается один раз при монтировании
  useEffect(() => {
    console.log('EffectDemo: только при монтировании');
  }, []);

  // 3) запускается при изменении count
  useEffect(() => {
    setLog(l => [...l, `count = ${count}`]);
    console.log('EffectDemo: count изменился →', count);
  }, [count]);

  return (
    <div className="effect-demo">
      <div>count = {count}</div>
      <button onClick={() => setCount(c => c + 1)}>Увеличить</button>
      <ul>{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
    </div>
  );
}

// ---------- ЗАДАНИЕ 7: Кастомные хуки и useContext ----------

// 7.1 useLocalStorage
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('localStorage error', e);
    }
  }, [key, value]);

  return [value, setValue];
}

// 7.2 useFetch
function useFetch(url) {
  const [state, setState] = useState({ data: null, loading: false, error: null });

  useEffect(() => {
    if (!url) return;
    let cancelled = false;
    setState({ data: null, loading: true, error: null });

    fetch(url)
      .then(r => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then(data => { if (!cancelled) setState({ data, loading: false, error: null }); })
      .catch(err => { if (!cancelled) setState({ data: null, loading: false, error: err.message }); });

    return () => { cancelled = true; };
  }, [url]);

  return state;
}

// 7.3 ThemeToggle + Context
const ThemeContext = createContext({ theme: 'light', toggle: () => {} });

function ThemeProvider({ children }) {
  const [theme, setTheme] = useLocalStorage('theme', 'light');
  const toggle = () => setTheme(t => (t === 'light' ? 'dark' : 'light'));
  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  );
}

function ThemeToggle() {
  const { theme, toggle } = useContext(ThemeContext);
  return (
    <div className={`theme-box theme-${theme}`}>
      <p>Текущая тема: <strong>{theme}</strong></p>
      <button onClick={toggle}>Переключить тему</button>
    </div>
  );
}

// Демонстрация useLocalStorage + useFetch
function LocalStorageDemo() {
  const [note, setNote] = useLocalStorage('note', '');
  return (
    <div>
      <input value={note} onChange={e => setNote(e.target.value)} placeholder="Заметка (localStorage)" />
    </div>
  );
}

function UseFetchDemo() {
  const { data, loading, error } = useFetch('https://jsonplaceholder.typicode.com/todos/1');
  if (loading) return <p>Загрузка...</p>;
  if (error)   return <p className="error">Ошибка: {error}</p>;
  return <pre className="json-view">{JSON.stringify(data, null, 2)}</pre>;
}

// ---------- Основной компонент ----------
function HooksComponents() {
  return (
    <section className="task-section">
      <h2>React Hooks</h2>

      <div className="component-demo">
        <h3>Задание 6: useState и useEffect</h3>
        <div id="hooks-output-1" className="output">
          <CounterWithHooks />
          <UserProfile />
          <EffectDemo />
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 7: Кастомные хуки и Context</h3>
        <div id="hooks-output-2" className="output">
          <LocalStorageDemo />
          <UseFetchDemo />
          <ThemeProvider>
            <ThemeToggle />
          </ThemeProvider>
        </div>
      </div>
    </section>
  );
}

export default HooksComponents;