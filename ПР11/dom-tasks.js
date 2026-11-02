// Задание 1: Создание и вставка элементов

function createCard(title, content) {
    const target = document.getElementById('target1');
    if (!target) return;

    const card = document.createElement('div');
    card.className = 'card';

    const h4 = document.createElement('h4');
    h4.textContent = title;

    const p = document.createElement('p');
    p.textContent = content;

    card.appendChild(h4);
    card.appendChild(p);
    target.appendChild(card);
}

function createList(items) {
    const target = document.getElementById('target1');
    if (!target || !Array.isArray(items)) return;

    const ol = document.createElement('ol');

    items.forEach(item => {
        const li = document.createElement('li');
        li.textContent = item;
        ol.appendChild(li);
    });

    target.appendChild(ol);
}

//Задание 2: Навигация по DOM

function countChildren() {
    const parent = document.getElementById('parent-element');
    if (!parent) return 0;
    return parent.children.length;
}

function findSpecialChild() {
    const parent = document.getElementById('parent-element');
    if (!parent) return null;

    const special = parent.querySelector('.special');
    return special ? special.textContent.trim() : null;
}

function getParentBackground() {
    const child = document.querySelector('.child');
    if (!child || !child.parentElement) return null;
    return getComputedStyle(child.parentElement).backgroundColor;
}

//Задание 3: Работа с классами и стилями

function setupStyleToggle() {
    const btn = document.getElementById('toggle-style');
    const target = document.getElementById('style-target');
    if (!btn || !target) return;

    btn.addEventListener('click', () => {
        target.classList.toggle('active-style');
    });
}

function changeHeaderColor() {
    const header = document.getElementById('main-header');
    if (!header) return;

    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    header.style.backgroundColor = `rgb(${r}, ${g}, ${b})`;
}

function animateElement() {
    const el = document.getElementById('style-target');
    if (!el) return;

    el.style.transition = 'all 0.5s ease';
    el.style.transform = 'scale(1.2)';
    el.style.opacity = '0.5';

    setTimeout(() => {
        el.style.transform = 'scale(1)';
        el.style.opacity = '1';
    }, 500);
}

//Задание 4: Обработка событий

function setupClickCounter() {
    const btn = document.getElementById('click-btn');
    const counter = document.getElementById('click-counter');
    if (!btn || !counter) return;

    let count = 0;
    btn.addEventListener('click', () => {
        count++;
        counter.textContent = `Кликов: ${count}`;
    });
}

function setupInputDisplay() {
    const input = document.getElementById('text-input');
    const display = document.getElementById('input-display');
    if (!input || !display) return;

    input.addEventListener('input', (e) => {
        display.textContent = e.target.value;
    });
}

function setupKeyboardEvents() {
    document.addEventListener('keydown', (e) => {
        console.log('keydown:', e.key, 'code:', e.code);
    });
    document.addEventListener('keyup', (e) => {
        console.log('keyup:', e.key, 'code:', e.code);
    });
}

//Задание 5: Динамические списки

function addListItem() {
    const input = document.getElementById('item-input');
    const list = document.getElementById('dynamic-list');
    if (!input || !list) return;

    const text = input.value.trim();
    if (!text) return;

    const li = document.createElement('li');
    li.className = 'list-item';
    li.textContent = text;

    const delBtn = document.createElement('button');
    delBtn.textContent = 'Удалить';
    delBtn.className = 'delete-btn';

    li.appendChild(delBtn);
    list.appendChild(li);

    input.value = '';
}

function removeListItem(event) {
    if (event.target.classList.contains('delete-btn')) {
        const li = event.target.closest('li');
        if (li) li.remove();
    }
}

function clearList() {
    const list = document.getElementById('dynamic-list');
    if (list) list.innerHTML = '';
}

function setupListEvents() {
    const addBtn = document.getElementById('add-item');
    const clearBtn = document.getElementById('clear-list');
    const list = document.getElementById('dynamic-list');

    if (addBtn) addBtn.addEventListener('click', addListItem);
    if (clearBtn) clearBtn.addEventListener('click', clearList);
    if (list) list.addEventListener('click', removeListItem);
}

//Задание 6: Работа с формами

function validateForm(formData) {
    const errors = {};

    const name = (formData.name || '').trim();
    const email = (formData.email || '').trim();
    const age = formData.age;

    if (!name || name.length < 2) {
        errors.name = 'Имя должно содержать минимум 2 символа';
    }

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = 'Некорректный email';
    }

    if (age !== '' && age !== null && age !== undefined) {
        const ageNum = Number(age);
        if (isNaN(ageNum) || ageNum < 1 || ageNum > 120) {
            errors.age = 'Возраст должен быть от 1 до 120';
        }
    }

    return errors;
}

function displayFormErrors(errors) {
    const output = document.getElementById('form-output');
    if (!output) return;

    output.innerHTML = '';
    output.className = 'error-message';

    Object.values(errors).forEach(msg => {
        const p = document.createElement('p');
        p.textContent = msg;
        output.appendChild(p);
    });
}

function displayFormSuccess(userData) {
    const output = document.getElementById('form-output');
    if (!output) return;

    output.innerHTML = '';
    output.className = 'success-message';

    const p = document.createElement('p');
    p.textContent = `Успешно! Имя: ${userData.name}, Email: ${userData.email}`;
    if (userData.age) p.textContent += `, Возраст: ${userData.age}`;
    output.appendChild(p);
}

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('user-name').value;
    const email = document.getElementById('user-email').value;
    const age = document.getElementById('user-age').value;

    const data = { name, email, age };
    const errors = validateForm(data);

    if (Object.keys(errors).length > 0) {
        displayFormErrors(errors);
    } else {
        displayFormSuccess(data);
    }
}

function setupForm() {
    const form = document.getElementById('user-form');
    if (form) form.addEventListener('submit', handleFormSubmit);
}

// Инициализация

function initializeApp() {
    setupStyleToggle();
    setupClickCounter();
    setupInputDisplay();
    setupKeyboardEvents();
    setupListEvents();
    setupForm();

    createCard('Пример карточки', 'Это содержимое карточки');
    createList(['Первый элемент', 'Второй элемент', 'Третий элемент']);

    console.log('Приложение инициализировано!');
}

document.addEventListener('DOMContentLoaded', initializeApp);