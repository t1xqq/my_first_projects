import React, { Component } from 'react';
import './StatefulComponents.css';

// ---------- ЗАДАНИЕ 3: Классовые компоненты с состоянием ----------

// 3.1 Counter
class Counter extends Component {
  constructor(props) {
    super(props);
    this.state = { count: props.initialValue || 0 };
  }
  inc = () => this.setState(s => ({ count: s.count + 1 }));
  dec = () => this.setState(s => ({ count: s.count - 1 }));
  reset = () => this.setState({ count: this.props.initialValue || 0 });

  render() {
    return (
      <div className="counter-widget">
        <div className="counter">{this.state.count}</div>
        <button onClick={this.dec}>−</button>
        <button onClick={this.inc}>+</button>
        <button onClick={this.reset}>Сброс</button>
      </div>
    );
  }
}

// 3.2 LoginForm
class LoginForm extends Component {
  state = { email: '', password: '', errors: {}, submitted: false };

  validate = () => {
    const errors = {};
    if (!this.state.email.includes('@')) errors.email = 'Некорректный email';
    if (this.state.password.length < 6) errors.password = 'Пароль минимум 6 символов';
    return errors;
  };

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value, submitted: false });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const errors = this.validate();
    this.setState({ errors, submitted: Object.keys(errors).length === 0 });
  };

  render() {
    const { email, password, errors, submitted } = this.state;
    return (
      <form className="login-form" onSubmit={this.handleSubmit}>
        <h4>Вход</h4>
        <div>
          <input name="email" placeholder="Email" value={email} onChange={this.handleChange} />
          {errors.email && <span className="form-error">{errors.email}</span>}
        </div>
        <div>
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={this.handleChange}
          />
          {errors.password && <span className="form-error">{errors.password}</span>}
        </div>
        <button type="submit">Войти</button>
        {submitted && <div className="form-success">Успешно!</div>}
      </form>
    );
  }
}

// 3.3 ColorPicker
class ColorPicker extends Component {
  state = { selected: this.props.colors?.[0] || '#000' };

  render() {
    const { colors = ['#e74c3c', '#2ecc71', '#3498db', '#f1c40f', '#9b59b6'] } = this.props;
    return (
      <div className="color-picker">
        <h4>Выберите цвет</h4>
        <div className="swatches">
          {colors.map(c => (
            <button
              key={c}
              className="swatch"
              style={{ background: c, border: this.state.selected === c ? '3px solid #2c3e50' : 'none' }}
              onClick={() => this.setState({ selected: c })}
              aria-label={c}
            />
          ))}
        </div>
        <div
          className="preview"
          style={{ background: this.state.selected, color: '#fff', padding: '1rem', borderRadius: 6 }}
        >
          Выбран: {this.state.selected}
        </div>
      </div>
    );
  }
}

// ---------- ЗАДАНИЕ 4: События и формы ----------

// 4.1 TodoList
class TodoList extends Component {
  state = {
    items: [],
    text: '',
  };

  add = (e) => {
    e.preventDefault();
    const text = this.state.text.trim();
    if (!text) return;
    this.setState(s => ({
      items: [...s.items, { id: Date.now(), text, done: false }],
      text: '',
    }));
  };

  toggle = (id) => {
    this.setState(s => ({
      items: s.items.map(i => (i.id === id ? { ...i, done: !i.done } : i)),
    }));
  };

  remove = (id) => {
    this.setState(s => ({ items: s.items.filter(i => i.id !== id) }));
  };

  render() {
    return (
      <div className="todo">
        <form onSubmit={this.add}>
          <input
            value={this.state.text}
            onChange={e => this.setState({ text: e.target.value })}
            placeholder="Новая задача"
          />
          <button type="submit">Добавить</button>
        </form>
        <ul>
          {this.state.items.map(item => (
            <li key={item.id} className={item.done ? 'done' : ''}>
              <label>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => this.toggle(item.id)}
                />
                {item.text}
              </label>
              <button onClick={() => this.remove(item.id)}>✕</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

// 4.2 SearchBox
class SearchBox extends Component {
  state = { query: '' };

  render() {
    const { items = [] } = this.props;
    const filtered = items.filter(i =>
      i.toLowerCase().includes(this.state.query.toLowerCase())
    );
    return (
      <div className="searchbox">
        <input
          value={this.state.query}
          onChange={e => this.setState({ query: e.target.value })}
          placeholder="Поиск..."
        />
        {this.state.query && (
          <button onClick={() => this.setState({ query: '' })}>Очистить</button>
        )}
        <ul>
          {filtered.map(i => <li key={i}>{i}</li>)}
        </ul>
      </div>
    );
  }
}

// ---------- Основной компонент ----------
class StatefulComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Компоненты с состоянием</h2>

        <div className="component-demo">
          <h3>Задание 3: Классовые компоненты</h3>
          <div id="stateful-output-1" className="output">
            <Counter initialValue={0} />
            <LoginForm />
            <ColorPicker colors={['#ff0000', '#00ff00', '#0000ff', '#ffcc00']} />
          </div>
        </div>

        <div className="component-demo">
          <h3>Задание 4: Обработка событий</h3>
          <div id="stateful-output-2" className="output">
            <TodoList />
            <SearchBox items={['React', 'JavaScript', 'HTML', 'CSS', 'TypeScript']} />
          </div>
        </div>
      </section>
    );
  }
}

export default StatefulComponents;