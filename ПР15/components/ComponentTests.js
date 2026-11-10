import React, { useState } from 'react';

export function ComponentTests() {
  const [results, setResults] = useState([]);

  const runTests = () => {
    const testResults = [];

    // Тест 1: базовые компоненты
    try {
      const basicComponents = document.querySelectorAll('#basic-output-1 > *');
      testResults.push({
        name: 'Базовые компоненты созданы',
        passed: basicComponents.length > 0,
        message: `Найдено компонентов: ${basicComponents.length}`,
      });
    } catch (error) {
      testResults.push({ name: 'Базовые компоненты', passed: false, message: `Ошибка: ${error.message}` });
    }

    // Тест 2: компоненты с состоянием
    try {
      const statefulComponents = document.querySelectorAll('#stateful-output-1 > *');
      testResults.push({
        name: 'Компоненты с состоянием созданы',
        passed: statefulComponents.length > 0,
        message: `Найдено компонентов: ${statefulComponents.length}`,
      });
    } catch (error) {
      testResults.push({ name: 'Компоненты с состоянием', passed: false, message: `Ошибка: ${error.message}` });
    }

    // Тест 3: hooks-компоненты
    try {
      const hooksComponents = document.querySelectorAll('#hooks-output-1 > *');
      testResults.push({
        name: 'Hooks компоненты созданы',
        passed: hooksComponents.length > 0,
        message: `Найдено компонентов: ${hooksComponents.length}`,
      });
    } catch (error) {
      testResults.push({ name: 'Hooks компоненты', passed: false, message: `Ошибка: ${error.message}` });
    }

    // Тест 4: методы жизненного цикла
    try {
      const lifecycle = document.querySelector('#lifecycle-output');
      testResults.push({
        name: 'Lifecycle компоненты присутствуют',
        passed: !!lifecycle,
        message: lifecycle ? 'DOM-узел найден' : 'DOM-узел отсутствует',
      });
    } catch (error) {
      testResults.push({ name: 'Lifecycle компоненты', passed: false, message: `Ошибка: ${error.message}` });
    }

    // Вывод в консоль
    console.log('=== РЕЗУЛЬТАТЫ ТЕСТИРОВАНИЯ ===');
    testResults.forEach(test => {
      console.log(`${test.passed ? '✔' : '✘'} ${test.name}: ${test.message}`);
    });

    const passed = testResults.filter(t => t.passed).length;
    const total  = testResults.length;

    setResults(testResults);
    alert(`Тестирование завершено: ${passed}/${total} тестов пройдено`);
  };

  return (
    <div style={{ marginTop: '2rem', textAlign: 'left', padding: '1.5rem', background: '#fff', borderRadius: 12 }}>
      <h2>Тестирование компонентов</h2>
      <button
        onClick={runTests}
        style={{
          background: '#27ae60',
          color: '#fff',
          border: 'none',
          padding: '0.75rem 1.5rem',
          borderRadius: 8,
          cursor: 'pointer',
          fontSize: '1rem',
        }}
      >
        Запустить тесты компонентов
      </button>

      <div style={{ marginTop: '2rem' }}>
        <h3>Инструкция по проверке:</h3>
        <ul>
          <li>Убедитесь, что все компоненты отображаются корректно</li>
          <li>Проверьте работу счётчиков и форм</li>
          <li>Убедитесь, что обработчики событий работают</li>
          <li>Проверьте работу хуков и жизненного цикла</li>
        </ul>
      </div>

      {results.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3>Результаты:</h3>
          {results.map((r, i) => (
            <div
              key={i}
              style={{
                padding: '0.75rem',
                margin: '0.5rem 0',
                borderRadius: 8,
                borderLeft: `5px solid ${r.passed ? '#27ae60' : '#e74c3c'}`,
                background: r.passed ? 'rgba(39,174,96,0.1)' : 'rgba(231,76,60,0.1)',
              }}
            >
              <strong>{r.passed ? '✔' : '✘'} {r.name}</strong>
              <div style={{ fontSize: '0.85rem', color: '#555' }}>{r.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ComponentTests;