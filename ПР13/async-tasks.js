// Вспомогательные функции

function displayOutput(elementId, data, isError = false) {
    const output = document.getElementById(elementId);
    if (!output) return;
    const timestamp = new Date().toLocaleTimeString();
    const content = typeof data === 'object' ? JSON.stringify(data, null, 2) : String(data);
    output.textContent = `[${timestamp}] ${content}`;
    output.className = `output ${isError ? 'error' : 'success'}`;
}

function updateProgress(percentage) {
    const progressFill = document.getElementById('progress-fill');
    if (progressFill) progressFill.style.width = `${percentage}%`;
}

function setLoadingState(buttonId, isLoading) {
    const button = document.getElementById(buttonId);
    if (!button) return;
    if (isLoading) {
        button.disabled = true;
        button.dataset.originalText = button.textContent;
        button.innerHTML = '<span class="spinner"></span> Загрузка...';
    } else {
        button.disabled = false;
        button.textContent = button.dataset.originalText || 'Готово';
    }
}

// Задание 1

function createBasicPromise(shouldResolve = true) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldResolve) resolve('Успех!');
            else reject(new Error('Ошибка!'));
        }, 1000);
    });
}

function handleBasicPromise() {
    displayOutput('promise-output', 'Загрузка...');
    createBasicPromise(true)
        .then(result => displayOutput('promise-output', `${result}`))
        .catch(err => displayOutput('promise-output', `${err.message}`, true));
}

function createPromiseChain() {
    displayOutput('promise-output', 'Цепочка запущена...');

    const delay = (ms, val) => new Promise(res => setTimeout(() => res(val), ms));

    delay(500, 'Шаг 1')
        .then(res => {
            displayOutput('promise-output', res);
            return delay(500, `${res} → Шаг 2`);
        })
        .then(res => {
            displayOutput('promise-output', res);
            return delay(500, `${res} → Шаг 3 (готово)`);
        })
        .then(res => displayOutput('promise-output', `${res}`))
        .catch(err => displayOutput('promise-output', `${err.message}`, true));
}

function handlePromiseError() {
    displayOutput('promise-output', 'Запуск промиса с ошибкой...');
    createBasicPromise(false)
        .then(result => displayOutput('promise-output', result))
        .catch(err => displayOutput('promise-output', `Ошибка перехвачена: ${err.message}`, true));
}

function setupPromiseEvents() {
    document.getElementById('basic-promise')?.addEventListener('click', handleBasicPromise);
    document.getElementById('promise-chain')?.addEventListener('click', createPromiseChain);
    document.getElementById('promise-error')?.addEventListener('click', handlePromiseError);
}

// Задание 2

async function basicAsyncAwait() {
    displayOutput('async-output', 'Ожидание...');
    try {
        const result = await createBasicPromise(true);
        await new Promise(res => setTimeout(res, 200));
        displayOutput('async-output', `${result}`);
    } catch (err) {
        displayOutput('async-output', `${err.message}`, true);
    }
}

async function handleAsyncError() {
    displayOutput('async-output', 'Проверка ошибки...');
    try {
        await createBasicPromise(false);
    } catch (err) {
        displayOutput('async-output', `Перехвачено: ${err.message}`, true);
    }
}

async function parallelAsyncExecution() {
    displayOutput('async-output', 'Параллельный запуск...');
    const start = performance.now();

    const p1 = new Promise(res => setTimeout(() => res('A'), 500));
    const p2 = new Promise(res => setTimeout(() => res('B'), 800));
    const p3 = new Promise(res => setTimeout(() => res('C'), 300));

    try {
        const results = await Promise.all([p1, p2, p3]);
        const duration = Math.round(performance.now() - start);
        displayOutput('async-output', `Все выполнены за ${duration}ms: ${results.join(', ')}`);
    } catch (err) {
        displayOutput('async-output', `${err.message}`, true);
    }
}

function setupAsyncEvents() {
    document.getElementById('basic-async')?.addEventListener('click', basicAsyncAwait);
    document.getElementById('async-error')?.addEventListener('click', handleAsyncError);
    document.getElementById('async-parallel')?.addEventListener('click', parallelAsyncExecution);
}

//Задание 3

async function fetchUsers() {
    const btn = 'fetch-users';
    setLoadingState(btn, true);
    displayOutput('api-output', 'Загрузка пользователей...');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/users');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const users = await response.json();

        const container = document.getElementById('api-data');
        if (container) {
            container.innerHTML = users.map(u => `
                <div class="user-card">
                    <strong>${u.name}</strong><br>
                    📧 ${u.email}<br>
                    🌐 ${u.website}
                </div>
            `).join('');
        }
        displayOutput('api-output', `Загружено ${users.length} пользователей`);
    } catch (err) {
        displayOutput('api-output', `${err.message}`, true);
    } finally {
        setLoadingState(btn, false);
    }
}

async function createPost() {
    const btn = 'fetch-post';
    setLoadingState(btn, true);
    displayOutput('api-output', 'Отправка поста...');

    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                title: 'Мой пост',
                body: 'Текст поста',
                userId: 1
            })
        });
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const post = await response.json();
        displayOutput('api-output', `Создан пост #${post.id}: ${post.title}`);
    } catch (err) {
        displayOutput('api-output', `${err.message}`, true);
    } finally {
        setLoadingState(btn, false);
    }
}

async function testApiError() {
    displayOutput('api-output', 'Тест ошибки API...');
    try {
        const response = await fetch('https://jsonplaceholder.typicode.com/unknown-endpoint');
        if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        const data = await response.json();
        displayOutput('api-output', data);
    } catch (err) {
        displayOutput('api-output', `Ошибка сети/API: ${err.message}`, true);
    }
}

function setupApiEvents() {
    document.getElementById('fetch-users')?.addEventListener('click', fetchUsers);
    document.getElementById('fetch-post')?.addEventListener('click', createPost);
    document.getElementById('fetch-error')?.addEventListener('click', testApiError);
}

//Задание 4

let intervalId = null;
let intervalCounter = 0;

async function startAsyncInterval() {
    if (intervalId) return;
    intervalCounter = 0;
    displayOutput('interval-output', 'Интервал запущен');

    intervalId = setInterval(async () => {
        intervalCounter++;
        await new Promise(res => setTimeout(res, 10));
        const output = document.getElementById('interval-output');
        if (output) output.textContent = `Интервал: ${intervalCounter}`;
    }, 1000);
}

function stopAsyncInterval() {
    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
    }
    intervalCounter = 0;
    const output = document.getElementById('interval-output');
    if (output) output.textContent = 'Интервал остановлен (0)';
}

function delayWithPromise(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function testDelay() {
    displayOutput('timer-output', 'Начало задержек...');

    await delayWithPromise(500);
    displayOutput('timer-output', 'Прошло 500мс');

    await delayWithPromise(1000);
    displayOutput('timer-output', 'Прошло ещё 1000мс (итого 1500мс)');

    await delayWithPromise(1500);
    displayOutput('timer-output', 'Все задержки завершены (3000мс)');
}

function setupTimerEvents() {
    document.getElementById('start-interval')?.addEventListener('click', startAsyncInterval);
    document.getElementById('stop-interval')?.addEventListener('click', stopAsyncInterval);
    document.getElementById('delay-promise')?.addEventListener('click', testDelay);
}

//Задание 5

async function asyncTryCatch() {
    displayOutput('error-output', 'Демонстрация try/catch...');

    try {
        await new Promise((_, rej) => setTimeout(() => rej(new Error('Ошибка сети')), 300));
    } catch (err) {
        try {
            await new Promise((_, rej) => setTimeout(() => rej(new Error('Ошибка парсинга')), 300));
        } catch (innerErr) {
            displayOutput('error-output', `Внешняя: ${err.message}\n Внутренняя: ${innerErr.message}`, true);
            return;
        }
    }
    displayOutput('error-output', 'Без ошибок');
}

async function handleMultipleErrors() {
    displayOutput('error-output', 'Запуск allSettled...');

    const promises = [
        Promise.resolve('OK-1'),
        Promise.reject(new Error('Fail-1')),
        Promise.resolve('OK-2'),
        Promise.reject(new Error('Fail-2'))
    ];

    const results = await Promise.allSettled(promises);
    const fulfilled = results.filter(r => r.status === 'fulfilled').length;
    const rejected = results.filter(r => r.status === 'rejected').length;

    displayOutput('error-output', `Успешно: ${fulfilled}, Ошибок: ${rejected}`);
}

async function retryWithBackoff(operation, maxRetries = 3) {
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            return await operation();
        } catch (err) {
            attempt++;
            if (attempt >= maxRetries) throw err;
            await new Promise(res => setTimeout(res, Math.pow(2, attempt) * 100));
        }
    }
}

async function testRetry() {
    displayOutput('error-output', 'Запуск retry...');
    let attempts = 0;

    try {
        const result = await retryWithBackoff(async () => {
            attempts++;
            if (attempts < 3) throw new Error(`Попытка ${attempts} не удалась`);
            return `Успех на попытке ${attempts}`;
        }, 3);
        displayOutput('error-output', `${result}`);
    } catch (err) {
        displayOutput('error-output', `Все попытки исчерпаны: ${err.message}`, true);
    }
}

function setupErrorEvents() {
    document.getElementById('try-catch')?.addEventListener('click', asyncTryCatch);
    document.getElementById('multiple-errors')?.addEventListener('click', handleMultipleErrors);
    document.getElementById('retry-pattern')?.addEventListener('click', testRetry);
}

//задание 6

async function demonstratePromiseAll() {
    displayOutput('parallel-output', 'Promise.all: запуск...');
    const start = performance.now();

    const promises = [
        new Promise(res => setTimeout(() => res('1'), 200)),
        new Promise(res => setTimeout(() => res('2'), 400)),
        new Promise(res => setTimeout(() => res('3'), 600)),
        new Promise(res => setTimeout(() => res('4'), 800)),
        new Promise(res => setTimeout(() => res('5'), 1000))
    ];

    try {
        const results = await Promise.all(promises);
        const duration = Math.round(performance.now() - start);
        displayOutput('parallel-output', `Promise.all: ${results.join(', ')} (${duration}мс)`);
    } catch (err) {
        displayOutput('parallel-output', `${err.message}`, true);
    }
}

async function demonstratePromiseRace() {
    displayOutput('parallel-output', 'Promise.race: запуск...');

    const p1 = new Promise(res => setTimeout(() => res('Быстрый (200мс)'), 200));
    const p2 = new Promise(res => setTimeout(() => res('Средний (500мс)'), 500));
    const p3 = new Promise(res => setTimeout(() => res('Медленный (1000мс)'), 1000));

    try {
        const winner = await Promise.race([p1, p2, p3]);
        displayOutput('parallel-output', `Promise.race: ${winner}`);
    } catch (err) {
        displayOutput('parallel-output', `${err.message}`, true);
    }
}

async function demonstratePromiseAllSettled() {
    displayOutput('parallel-output', 'Promise.allSettled: запуск...');

    const promises = [
        Promise.resolve('OK-1'),
        Promise.reject(new Error('Fail-1')),
        Promise.resolve('OK-2')
    ];

    const results = await Promise.allSettled(promises);
    const stats = results.map(r =>
        r.status === 'fulfilled' ? `${r.value}` : `${r.reason.message}`
    ).join('\n');

    displayOutput('parallel-output', `Promise.allSettled:\n${stats}`);
}

function setupParallelEvents() {
    document.getElementById('promise-all')?.addEventListener('click', demonstratePromiseAll);
    document.getElementById('promise-race')?.addEventListener('click', demonstratePromiseRace);
    document.getElementById('promise-allSettled')?.addEventListener('click', demonstratePromiseAllSettled);
}

//Задание 7

async function sequentialApiRequests() {
    displayOutput('scenario-output', 'Последовательные запросы...');

    try {
        const userRes = await fetch('https://jsonplaceholder.typicode.com/users/1');
        const user = await userRes.json();
        displayOutput('scenario-output', `👤 ${user.name}`);

        const postsRes = await fetch(`https://jsonplaceholder.typicode.com/posts?userId=${user.id}`);
        const posts = await postsRes.json();
        displayOutput('scenario-output', `👤 ${user.name}\n📝 Постов: ${posts.length}`);

        const commentsRes = await fetch(`https://jsonplaceholder.typicode.com/comments?postId=${posts[0].id}`);
        const comments = await commentsRes.json();
        displayOutput('scenario-output',
            `👤 ${user.name}\n📝 Постов: ${posts.length}\n💬 Комментариев к первому: ${comments.length}`
        );
    } catch (err) {
        displayOutput('scenario-output', `${err.message}`, true);
    }
}

async function simulateFileUpload() {
    displayOutput('scenario-output', 'Симуляция загрузки файла...');
    updateProgress(0);

    for (let i = 1; i <= 100; i += 10) {
        await delayWithPromise(100);
        updateProgress(i);
        const output = document.getElementById('scenario-output');
        if (output) output.textContent = `Загрузка: ${i}%`;
    }

    displayOutput('scenario-output', 'Файл загружен');
    updateProgress(0);
}

function createRequestCache() {
    const cache = new Map();
    return async function cachedRequest(url) {
        if (cache.has(url)) {
            console.log(`[cache] Использую кэш для ${url}`);
            return cache.get(url);
        }
        const response = await fetch(url);
        const data = await response.json();
        cache.set(url, data);
        return data;
    };
}

async function testCache() {
    displayOutput('scenario-output', 'Тест кэширования...');
    const cachedFetch = createRequestCache();
    const url = 'https://jsonplaceholder.typicode.com/users/1';

    const t1 = performance.now();
    const data1 = await cachedFetch(url);
    const time1 = Math.round(performance.now() - t1);

    const t2 = performance.now();
    const data2 = await cachedFetch(url);
    const time2 = Math.round(performance.now() - t2);

    displayOutput('scenario-output',
        `Первый запрос: ${time1}мс\nВторой (из кэша): ${time2}мс\nПользователь: ${data1.name}`
    );
}

function setupRealScenarioEvents() {
    document.getElementById('sequential-requests')?.addEventListener('click', sequentialApiRequests);
    document.getElementById('upload-simulation')?.addEventListener('click', simulateFileUpload);
    document.getElementById('cache-requests')?.addEventListener('click', testCache);
}

// Инициализация

function initializeAsyncOperations() {
    setupPromiseEvents();
    setupAsyncEvents();
    setupApiEvents();
    setupTimerEvents();
    setupErrorEvents();
    setupParallelEvents();
    setupRealScenarioEvents();
    console.log('Все асинхронные обработчики инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeAsyncOperations);