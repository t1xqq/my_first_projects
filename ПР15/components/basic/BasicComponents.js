import React from 'react';
import './BasicComponents.css';

// ---------- ЗАДАНИЕ 1: Функциональные компоненты с props ----------

// 1.1 WelcomeMessage
function WelcomeMessage({ name, age }) {
  return (
    <div className="welcome-message">
      <h3>Привет, {name}!</h3>
      <p>Тебе {age} лет.</p>
    </div>
  );
}

// 1.2 UserCard
function UserCard({ user }) {
  return (
    <div className="user-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <img
        src={user.avatar}
        alt={user.name}
        style={{ width: 60, height: 60, borderRadius: '50%' }}
      />
      <div>
        <h4>{user.name}</h4>
        <p>{user.email}</p>
        <span className={user.isOnline ? 'online' : 'offline'}>
          {user.isOnline ? '● Онлайн' : '○ Офлайн'}
        </span>
      </div>
    </div>
  );
}

// 1.3 Button
function Button({ variant = 'primary', size = 'medium', onClick, children, ...rest }) {
  const className = `btn btn-${variant} btn-${size}`;
  return (
    <button className={className} onClick={onClick} {...rest}>
      {children}
    </button>
  );
}

// ---------- ЗАДАНИЕ 2: children и условный рендеринг ----------

// 2.1 Card
function Card({ title, children }) {
  return (
    <div className="card">
      {title && <h4 className="card-title">{title}</h4>}
      <div className="card-body">{children}</div>
    </div>
  );
}

// 2.2 Toggle
function Toggle({ buttonText = 'Показать/скрыть', children }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="toggle">
      <button onClick={() => setOpen(v => !v)}>
        {open ? 'Скрыть' : buttonText}
      </button>
      {open && <div className="toggle-content">{children}</div>}
    </div>
  );
}

// 2.3 ConditionalMessage
function ConditionalMessage({ status }) {
  const config = {
    success: { text: 'Операция прошла успешно!', cls: 'success' },
    error:   { text: 'Произошла ошибка!',       cls: 'error'   },
    warning: { text: 'Внимание!',               cls: 'warning' },
  };
  const c = config[status];
  if (!c) return null;
  return <div className={`conditional-message ${c.cls}`}>{c.text}</div>;
}

// ---------- Основной компонент раздела ----------
function BasicComponents() {
  const userData = {
    name: 'Анна Иванова',
    email: 'anna@example.com',
    avatar: 'https://i.pravatar.cc/100',
    isOnline: true,
  };

  return (
    <section className="task-section">
      <h2>Базовые компоненты</h2>

      <div className="component-demo">
        <h3>Задание 1: Компоненты с props</h3>
        <div id="basic-output-1" className="output">
          <WelcomeMessage name="Иван" age={25} />
          <UserCard user={userData} />
          <div>
            <Button variant="primary" onClick={() => alert('Клик!')}>
              Основная кнопка
            </Button>
            <Button variant="secondary" size="small" onClick={() => alert('Вторая!')}>
              Маленькая
            </Button>
            <Button variant="primary" size="large" disabled>
              Отключена
            </Button>
          </div>
        </div>
      </div>

      <div className="component-demo">
        <h3>Задание 2: Children и условный рендеринг</h3>
        <div id="basic-output-2" className="output">
          <Card title="Пример карточки">
            <p>Это содержимое карточки</p>
          </Card>
          <Toggle buttonText="Показать секрет">
            <p>Секретный контент!</p>
          </Toggle>
          <ConditionalMessage status="success" />
          <ConditionalMessage status="error" />
          <ConditionalMessage status="warning" />
        </div>
      </div>
    </section>
  );
}

export default BasicComponents;