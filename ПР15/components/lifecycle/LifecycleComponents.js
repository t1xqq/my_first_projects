import React, { Component } from 'react';
import './LifecycleComponents.css';

// ---------- ЗАДАНИЕ 5: Жизненный цикл ----------

// 5.1 Timer
class Timer extends Component {
  state = { seconds: 0, running: false };

  componentDidMount() {
    console.log('Timer: componentDidMount');
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.running && !prevState.running) {
      this.interval = setInterval(() => {
        this.setState(s => ({ seconds: s.seconds + 1 }));
      }, 1000);
    }
    if (!this.state.running && prevState.running) {
      clearInterval(this.interval);
    }
  }

  componentWillUnmount() {
    console.log('Timer: componentWillUnmount — очистка интервала');
    clearInterval(this.interval);
  }

  start = () => this.setState({ running: true });
  stop  = () => this.setState({ running: false });
  reset = () => this.setState({ seconds: 0, running: false });

  render() {
    const { seconds, running } = this.state;
    return (
      <div className="timer">
        <div className="timer-display">{seconds} с</div>
        <button onClick={this.start} disabled={running}>Старт</button>
        <button onClick={this.stop} disabled={!running}>Стоп</button>
        <button onClick={this.reset}>Сброс</button>
      </div>
    );
  }
}

// 5.2 WindowSizeTracker
class WindowSizeTracker extends Component {
  state = { width: window.innerWidth, height: window.innerHeight };

  handleResize = () => {
    this.setState({ width: window.innerWidth, height: window.innerHeight });
  };

  componentDidMount() {
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  render() {
    return (
      <div className="window-size">
        Ширина: {this.state.width}px, Высота: {this.state.height}px
      </div>
    );
  }
}

// 5.3 DataFetcher
class DataFetcher extends Component {
  state = { data: null, loading: false, error: null };

  componentDidMount() {
    this.fetchData(this.props.url);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.url !== this.props.url) {
      this.fetchData(this.props.url);
    }
  }

  fetchData = async (url) => {
    this.setState({ loading: true, error: null, data: null });
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      this.setState({ data, loading: false });
    } catch (err) {
      this.setState({ error: err.message, loading: false });
    }
  };

  render() {
    const { data, loading, error } = this.state;
    if (loading) return <div className="loading">Загрузка...</div>;
    if (error)   return <div className="error">Ошибка: {error}</div>;
    if (!data)   return null;
    return (
      <div className="data-fetcher">
        <h4>Пользователи (первые 5):</h4>
        <ul>
          {data.slice(0, 5).map(u => (
            <li key={u.id}>{u.name} — {u.email}</li>
          ))}
        </ul>
      </div>
    );
  }
}

// ---------- Основной компонент ----------
class LifecycleComponents extends Component {
  render() {
    return (
      <section className="task-section">
        <h2>Жизненный цикл компонентов</h2>
        <div className="component-demo">
          <h3>Задание 5: Методы жизненного цикла</h3>
          <div id="lifecycle-output" className="output">
            <Timer />
            <WindowSizeTracker />
            <DataFetcher url="https://jsonplaceholder.typicode.com/users" />
          </div>
        </div>
      </section>
    );
  }
}

export default LifecycleComponents;