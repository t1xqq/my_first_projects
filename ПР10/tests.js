// tests.js - Тестирование всех реализованных функций

// ==================== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ ====================

/**
 * Универсальная функция для запуска теста
 * @param {string} name - Название теста
 * @param {Function} testFn - Функция с тестом (должна вернуть true при успехе)
 */
function runTest(name, testFn) {
    const resultDiv = document.getElementById('testResults');
    const taskDiv = document.createElement('div');
    taskDiv.className = 'test-result';

    try {
        const passed = testFn();
        if (passed) {
            taskDiv.classList.add('success');
            taskDiv.textContent = `✅ ${name}`;
            console.log(`%c✅ PASSED: ${name}`, 'color: green');
        } else {
            taskDiv.classList.add('error');
            taskDiv.textContent = `❌ FAILED: ${name}`;
            console.error(`❌ FAILED: ${name}`);
        }
    } catch (error) {
        taskDiv.classList.add('error');
        taskDiv.textContent = `❌ ERROR: ${name} — ${error.message}`;
        console.error(`❌ ERROR: ${name}`, error);
    }

    resultDiv.appendChild(taskDiv);
}

/**
 * Сравнение массивов (для тестов map/filter/reduce)
 */
function arraysEqual(a, b) {
    if (a.length !== b.length) return false;
    return a.every((val, i) => val === b[i]);
}

/**
 * Сравнение объектов по значению
 */
function objectsEqual(a, b) {
    return JSON.stringify(a) === JSON.stringify(b);
}

// Базовые функции

console.log('%c Базовые функции', 'color: blue; font-weight: bold');

// sum
runTest('sum: обычные числа', () => sum(1, 2, 3) === 6);
runTest('sum: отрицательные числа', () => sum(-1, -2, -3) === -6);
runTest('sum: смешанные числа', () => sum(10, -5, 3) === 8);
runTest('sum: один аргумент', () => sum(42) === 42);
runTest('sum: без аргументов (краевой случай)', () => sum() === 0);
runTest('sum: дробные числа', () => Math.abs(sum(0.1, 0.2) - 0.3) < 0.0001);

// createUser
runTest('createUser: все поля', () =>
    createUser({ name: 'Иван', age: 25, email: 'ivan@test.ru' }) ===
    'Пользователь: Иван, возраст: 25, email: ivan@test.ru'
);
runTest('createUser: без email (краевой случай)', () =>
    createUser({ name: 'Мария', age: 30 }) ===
    'Пользователь: Мария, возраст: 30, email: не указан'
);
runTest('createUser: возраст 0 (краевой случай)', () =>
    createUser({ name: 'Ребенок', age: 0 }) ===
    'Пользователь: Ребенок, возраст: 0, email: не указан'
);
runTest('createUser: пустое имя', () =>
    createUser({ name: '', age: 20 }) ===
    'Пользователь: , возраст: 20, email: не указан'
);

// secretMessage
runTest('secretMessage: верный пароль', () => {
    const getSecret = secretMessage('1234', 'Секрет');
    return getSecret('1234') === 'Секрет';
});
runTest('secretMessage: неверный пароль', () => {
    const getSecret = secretMessage('1234', 'Секрет');
    return getSecret('wrong') === 'Доступ запрещен';
});
runTest('secretMessage: пустой пароль (краевой случай)', () => {
    const getSecret = secretMessage('', 'Секрет');
    return getSecret('') === 'Секрет';
});
runTest('secretMessage: независимость замыканий', () => {
    const s1 = secretMessage('a', 'Первый');
    const s2 = secretMessage('b', 'Второй');
    return s1('a') === 'Первый' && s2('b') === 'Второй' && s1('b') === 'Доступ запрещен';
});

// Функции высшего порядка

console.log('%cФункции высшего порядка', 'color: blue; font-weight: bold');

// compose
runTest('compose: две функции', () => {
    const addOne = x => x + 1;
    const double = x => x * 2;
    // compose(addOne, double)(3) = addOne(double(3)) = 7
    return compose(addOne, double)(3) === 7;
});
runTest('compose: три функции', () => {
    const addOne = x => x + 1;
    const double = x => x * 2;
    const square = x => x * x;
    // compose(square, double, addOne)(2) = square(double(addOne(2))) = square(6) = 36
    return compose(square, double, addOne)(2) === 36;
});
runTest('compose: без функций (краевой случай)', () =>
    compose()(5) === 5
);
runTest('compose: одна функция', () =>
    compose(x => x * 10)(3) === 30
);

// myMap
runTest('myMap: удвоение', () =>
    arraysEqual(myMap([1, 2, 3], x => x * 2), [2, 4, 6])
);
runTest('myMap: пустой массив (краевой случай)', () =>
    arraysEqual(myMap([], x => x * 2), [])
);
runTest('myMap: передача индекса в callback', () =>
    arraysEqual(myMap(['a', 'b', 'c'], (item, i) => `${i}:${item}`), ['0:a', '1:b', '2:c'])
);
runTest('myMap: не мутирует исходный массив', () => {
    const original = [1, 2, 3];
    myMap(original, x => x * 2);
    return arraysEqual(original, [1, 2, 3]);
});

// myFilter
runTest('myFilter: четные числа', () =>
    arraysEqual(myFilter([1, 2, 3, 4, 5, 6], x => x % 2 === 0), [2, 4, 6])
);
runTest('myFilter: пустой массив (краевой случай)', () =>
    arraysEqual(myFilter([], x => true), [])
);
runTest('myFilter: все отфильтрованы', () =>
    arraysEqual(myFilter([1, 3, 5], x => x % 2 === 0), [])
);
runTest('myFilter: передача индекса', () =>
    arraysEqual(myFilter([10, 20, 30], (item, i) => i > 0), [20, 30])
);

// myReduce
runTest('myReduce: сумма с начальным значением', () =>
    myReduce([1, 2, 3, 4], (acc, x) => acc + x, 0) === 10
);
runTest('myReduce: сумма без начального значения (краевой случай)', () =>
    myReduce([1, 2, 3, 4], (acc, x) => acc + x) === 10
);
runTest('myReduce: один элемент без начального значения', () =>
    myReduce([5], (acc, x) => acc + x) === 5
);
runTest('myReduce: пустой массив с начальным значением', () =>
    myReduce([], (acc, x) => acc + x, 100) === 100
);
runTest('myReduce: пустой массив без начального значения (должна быть ошибка)', () => {
    try {
        myReduce([], (acc, x) => acc + x);
        return false; // Ошибка не была выброшена - тест провален
    } catch (e) {
        return e instanceof TypeError;
    }
});
runTest('myReduce: поиск максимума', () =>
    myReduce([3, 7, 2, 9, 1], (max, x) => Math.max(max, x), -Infinity) === 9
);

// Продвинутые функции

console.log('%cПродвинутые функции', 'color: blue; font-weight: bold');

// curry
runTest('curry: сумма трех чисел', () => {
    const curriedAdd = curry((a, b, c) => a + b + c);
    return curriedAdd(1)(2)(3) === 6;
});
runTest('curry: частичное применение', () => {
    const curriedAdd = curry((a, b, c) => a + b + c);
    return curriedAdd(1, 2)(3) === 6 && curriedAdd(1)(2, 3) === 6;
});
runTest('curry: все аргументы сразу', () => {
    const curriedAdd = curry((a, b, c) => a + b + c);
    return curriedAdd(1, 2, 3) === 6;
});
runTest('curry: функция с одним аргументом (краевой случай)', () => {
    const curriedInc = curry(x => x + 1);
    return curriedInc(5) === 6;
});
runTest('curry: с функцией умножения', () => {
    const curriedMul = curry((a, b) => a * b);
    return curriedMul(3)(4) === 12;
});

// memoize
runTest('memoize: кэширует результат', () => {
    let callCount = 0;
    const expensiveFn = memoize((x) => { callCount++; return x * 2; });
    expensiveFn(5);
    expensiveFn(5);
    expensiveFn(5);
    return callCount === 1; // Функция вызвана только 1 раз
});
runTest('memoize: разные аргументы — разные результаты', () => {
    const fn = memoize((x) => x * 2);
    return fn(5) === 10 && fn(10) === 20;
});
runTest('memoize: несколько аргументов', () => {
    let callCount = 0;
    const fn = memoize((a, b) => { callCount++; return a + b; });
    fn(1, 2);
    fn(1, 2);
    return callCount === 1;
});
runTest('memoize: возвращает правильные значения', () => {
    const factorial = memoize((n) => n <= 1 ? 1 : n * factorial(n - 1));
    return factorial(5) === 120;
});

// debounce
runTest('debounce: вызывает функцию один раз (асинхронно)', () => {
    return new Promise((resolve) => {
        let callCount = 0;
        const debounced = debounce(() => callCount++, 50);
        debounced();
        debounced();
        debounced();
        setTimeout(() => {
            resolve(callCount === 1);
        }, 100);
    });
});

// throttle
runTest('throttle: ограничивает частоту вызовов', () => {
    return new Promise((resolve) => {
        let callCount = 0;
        const throttled = throttle(() => callCount++, 50);
        throttled(); // выполнится
        throttled(); // заблокирован
        throttled(); // заблокирован
        setTimeout(() => {
            resolve(callCount === 1);
        }, 100);
    });
});

// createValidator
runTest('createValidator: валидный пароль', () => {
    const validator = createValidator({ minLength: 8 });
    const result = validator('Password123');
    return result.isValid === true && result.errors.length === 0;
});
runTest('createValidator: слишком короткий пароль', () => {
    const validator = createValidator({ minLength: 8 });
    const result = validator('Pass1');
    return result.isValid === false && result.errors.length > 0;
});
runTest('createValidator: нет цифры', () => {
    const validator = createValidator({ minLength: 8, requireDigit: true });
    const result = validator('PasswordOnly');
    return result.isValid === false && result.errors.some(e => e.includes('цифра'));
});
runTest('createValidator: нет заглавной буквы', () => {
    const validator = createValidator({ minLength: 8, requireUppercase: true });
    const result = validator('password123');
    return result.isValid === false && result.errors.some(e => e.includes('заглавная'));
});
runTest('createValidator: кириллица с заглавной', () => {
    const validator = createValidator({ minLength: 8 });
    const result = validator('Пароль123');
    return result.isValid === true;
});
runTest('createValidator: пустая строка (краевой случай)', () => {
    const validator = createValidator({ minLength: 1 });
    const result = validator('');
    return result.isValid === false;
});
runTest('createValidator: несколько ошибок сразу', () => {
    const validator = createValidator({ minLength: 10 });
    const result = validator('abc');
    return result.isValid === false && result.errors.length >= 3;
});
runTest('createValidator: отключенные проверки', () => {
    const validator = createValidator({
        minLength: 3,
        requireDigit: false,
        requireUppercase: false
    });
    const result = validator('abc');
    return result.isValid === true;
});

// итог
console.log('%c=== Тестирование завершено ===', 'color: green; font-weight: bold; font-size: 14px');