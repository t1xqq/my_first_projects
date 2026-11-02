// Задание 1
function handleBasicClick(event) {
    const output = document.getElementById('basic-output');
    const btn = event.currentTarget;

    output.textContent = `Тип: ${event.type} | Координаты: (${event.clientX}, ${event.clientY}) | Target: ${event.target.tagName}`;

    btn.classList.add('pulse');
    setTimeout(() => btn.classList.remove('pulse'), 500);
}

function handleMouseEvents(event) {
    const box = document.getElementById('color-box');
    const output = document.getElementById('mouse-output');
    if (!box || !output) return;

    switch (event.type) {
        case 'mouseenter':
            box.style.background = '#e74c3c';
            break;
        case 'mouseleave':
            box.style.background = '#3498db';
            break;
        case 'mousemove':
            output.textContent = `Координаты мыши: X=${event.offsetX}, Y=${event.offsetY}`;
            break;
    }
}

function setupBasicEvents() {
    const btn = document.getElementById('basic-btn');
    const box = document.getElementById('color-box');

    if (btn) btn.addEventListener('click', handleBasicClick);
    if (box) {
        box.addEventListener('mouseenter', handleMouseEvents);
        box.addEventListener('mouseleave', handleMouseEvents);
        box.addEventListener('mousemove', handleMouseEvents);
    }
}

// Задание 2

function handleKeyEvents(event) {
    const output = document.getElementById('key-output');
    if (!output) return;

    if ((event.ctrlKey && event.key === 's') ||
        (event.altKey && event.key === 'c') ||
        (event.shiftKey && event.key === 'A')) {
        event.preventDefault();
        output.textContent = `Комбинация перехвачена: ${event.key} (Ctrl:${event.ctrlKey} Alt:${event.altKey} Shift:${event.shiftKey})`;
        return;
    }

    output.textContent = `key: ${event.key} | code: ${event.code} | ctrl:${event.ctrlKey} alt:${event.altKey} shift:${event.shiftKey}`;
}

function setupKeyboardEvents() {
    const input = document.getElementById('key-input');
    if (!input) return;

    input.addEventListener('keydown', handleKeyEvents);
    input.addEventListener('keyup', (e) => {
        const output = document.getElementById('key-output');
        if (output) output.textContent += ` | keyup: ${e.key}`;
    });
}

// Задание 3

function handleDelegationClick(event) {
    const list = document.getElementById('item-list');
    const output = document.getElementById('delegation-output');
    if (!list) return;

    if (event.target.classList.contains('delete')) {
        const item = event.target.closest('.item');
        if (item) item.remove();
    } else if (event.target.closest('.item')) {
        const item = event.target.closest('.item');
        item.classList.toggle('selected');
    }

    if (output) {
        const selected = list.querySelectorAll('.item.selected').length;
        output.textContent = `Выбрано: ${selected} элементов`;
    }
}

function addNewItem() {
    const list = document.getElementById('item-list');
    if (!list) return;

    const id = Date.now();
    const item = document.createElement('div');
    item.className = 'item';
    item.dataset.id = id;
    item.innerHTML = `<span>Элемент ${id}</span><span class="delete">✕</span>`;
    list.appendChild(item);
}

function setupDelegationEvents() {
    const list = document.getElementById('item-list');
    const addBtn = document.getElementById('add-item-btn');

    if (list) list.addEventListener('click', handleDelegationClick);
    if (addBtn) addBtn.addEventListener('click', addNewItem);
}

// Задание 4

function preventLinkDefault(event) {
    event.preventDefault();
    const output = document.getElementById('prevention-output');
    const link = event.currentTarget;

    if (output) output.textContent = 'Ссылка заблокирована! Переход отменён.';
    link.classList.add('shake');
    setTimeout(() => link.classList.remove('shake'), 300);
}

function preventFormSubmit(event) {
    event.preventDefault();
    const output = document.getElementById('prevention-output');
    const input = document.getElementById('prevent-input');

    if (!input || !input.value.trim()) {
        if (output) output.textContent = 'Ошибка: поле не может быть пустым';
        return;
    }

    if (output) output.textContent = `Данные: "${input.value}"`;
    input.value = '';
}

function setupPreventionEvents() {
    const link = document.getElementById('prevent-link');
    const form = document.getElementById('prevent-form');

    if (link) link.addEventListener('click', preventLinkDefault);
    if (form) form.addEventListener('submit', preventFormSubmit);
}

// Задание 5

function triggerCustomEvent() {
    const event = new CustomEvent('customAction', {
        detail: { message: 'Привет от кастомного события!' }
    });
    document.dispatchEvent(event);
}

function handleCustomEvent(event) {
    const output = document.getElementById('custom-output');
    if (output) output.textContent = ` ${event.detail.message}`;

    const btn = document.getElementById('trigger-custom');
    if (btn) {
        btn.classList.add('pulse');
        setTimeout(() => btn.classList.remove('pulse'), 500);
    }
}

function setupMultipleListeners() {
    document.addEventListener('customAction', () => console.log('Слушатель 1: событие получено'));
    document.addEventListener('customAction', () => console.log('Слушатель 2: событие получено'));
    document.addEventListener('customAction', () => console.log('Слушатель 3: событие получено'));
}

function setupCustomEvents() {
    document.addEventListener('customAction', handleCustomEvent);

    const triggerBtn = document.getElementById('trigger-custom');
    const multipleBtn = document.getElementById('multiple-listeners');

    if (triggerBtn) triggerBtn.addEventListener('click', triggerCustomEvent);
    if (multipleBtn) multipleBtn.addEventListener('click', setupMultipleListeners);
}

// Задание 6

function loadImageWithEvents() {
    const container = document.getElementById('image-container');
    const output = document.getElementById('loading-output');
    if (!container || !output) return;

    container.innerHTML = '';
    output.textContent = 'Статус: загрузка начата...';

    const img = new Image();
    img.src = 'https://picsum.photos/300/200?' + Date.now();

    img.addEventListener('loadstart', () => {
        output.textContent = 'Статус: загрузка начата...';
        container.classList.add('loading');
    });

    img.addEventListener('load', () => {
        output.textContent = 'Изображение загружено';
        container.classList.remove('loading');
        container.classList.add('success');
    });

    img.addEventListener('error', () => {
        output.textContent = 'Ошибка загрузки изображения';
        container.classList.remove('loading');
        container.classList.add('error');
    });

    img.addEventListener('loadend', () => {
        output.textContent += ' | загрузка завершена';
    });

    container.appendChild(img);
}

function simulateLoadError() {
    const container = document.getElementById('image-container');
    const output = document.getElementById('loading-output');
    if (!container || !output) return;

    container.innerHTML = '';
    output.textContent = 'Попытка загрузки несуществующего изображения...';

    const img = new Image();
    img.src = 'https://example.com/not-found-image.jpg';

    img.addEventListener('error', () => {
        output.textContent = 'Ошибка: изображение не найдено (симуляция)';
        container.classList.add('error');
    });

    container.appendChild(img);
}

function setupLoadingEvents() {
    const loadBtn = document.getElementById('load-image');
    const errorBtn = document.getElementById('load-error');

    if (loadBtn) loadBtn.addEventListener('click', loadImageWithEvents);
    if (errorBtn) errorBtn.addEventListener('click', simulateLoadError);
}

// Задание 7

let timerInterval = null;
let timerValue = 0;

function startTimer() {
    const output = document.getElementById('timer-output');
    if (timerInterval) return;

    timerValue = 0;
    timerInterval = setInterval(() => {
        timerValue++;
        if (output) output.textContent = `Таймер: ${timerValue}с`;
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerValue = 0;
    const output = document.getElementById('timer-output');
    if (output) output.textContent = 'Таймер: 0с (остановлен)';
}

function createDebounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

function createThrottle(func, interval) {
    let lastTime = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastTime >= interval) {
            lastTime = now;
            func.apply(this, args);
        }
    };
}

function testDebounce() {
    const output = document.getElementById('async-output');
    let calls = 0;

    const debounced = createDebounce(() => {
        calls++;
        if (output) output.textContent = `Debounce: выполнено ${calls} раз (после паузы)`;
    }, 500);

    if (output) output.textContent = 'Debounce: быстрые клики...';
    for (let i = 0; i < 5; i++) {
        setTimeout(() => debounced(), i * 100);
    }
}

function testThrottle() {
    const output = document.getElementById('async-output');
    let calls = 0;

    const throttled = createThrottle(() => {
        calls++;
        if (output) output.textContent = `Throttle: выполнено ${calls} раз (не чаще раза в 500мс)`;
    }, 500);

    if (output) output.textContent = 'Throttle: быстрые клики...';
    for (let i = 0; i < 5; i++) {
        setTimeout(() => throttled(), i * 100);
    }
}

function setupTimerEvents() {
    const startBtn = document.getElementById('start-timer');
    const stopBtn = document.getElementById('stop-timer');
    const debounceBtn = document.getElementById('debounce-btn');
    const throttleBtn = document.getElementById('throttle-btn');

    if (startBtn) startBtn.addEventListener('click', startTimer);
    if (stopBtn) stopBtn.addEventListener('click', stopTimer);
    if (debounceBtn) debounceBtn.addEventListener('click', testDebounce);
    if (throttleBtn) throttleBtn.addEventListener('click', testThrottle);
}

//Инициализация

function initializeEventHandler() {
    setupBasicEvents();
    setupKeyboardEvents();
    setupDelegationEvents();
    setupPreventionEvents();
    setupCustomEvents();
    setupLoadingEvents();
    setupTimerEvents();
    console.log('Все обработчики событий инициализированы!');
}

document.addEventListener('DOMContentLoaded', initializeEventHandler);