function runTests() {
    const results = [];

    function test(name, fn) {
        try {
            const ok = fn();
            results.push({ name, ok });
            console.log(ok ? `${name}` : `${name}`);
        } catch (e) {
            results.push({ name, ok: false });
            console.error(`${name}: ${e.message}`);
        }
    }

    // Ждём инициализации DOM
    test('createCard создаёт карточку в #target1', () => {
        return document.querySelector('#target1 .card') !== null;
    });

    test('createList создаёт ol с элементами', () => {
        const ol = document.querySelector('#target1 ol');
        return ol && ol.children.length === 3;
    });

    test('countChildren возвращает 3', () => {
        return countChildren() === 3;
    });

    test('findSpecialChild находит особый элемент', () => {
        const text = findSpecialChild();
        return text && text.includes('Особый');
    });

    test('getParentBackground возвращает цвет', () => {
        const bg = getParentBackground();
        return typeof bg === 'string' && bg.length > 0;
    });

    test('classList.toggle работает на #style-target', () => {
        const el = document.getElementById('style-target');
        el.classList.toggle('active-style');
        const has = el.classList.contains('active-style');
        el.classList.toggle('active-style');
        return has === true;
    });

    test('addListItem добавляет элемент в список', () => {
        const input = document.getElementById('item-input');
        input.value = 'Тестовый элемент';
        addListItem();
        return document.querySelectorAll('#dynamic-list .list-item').length > 0;
    });

    test('validateForm: пустое имя — ошибка', () => {
        const errors = validateForm({ name: '', email: 'a@b.c', age: '10' });
        return !!errors.name;
    });

    test('validateForm: корректные данные — без ошибок', () => {
        const errors = validateForm({ name: 'Иван', email: 'a@b.c', age: '25' });
        return Object.keys(errors).length === 0;
    });

    test('validateForm: неверный email — ошибка', () => {
        const errors = validateForm({ name: 'Иван', email: 'bad', age: '25' });
        return !!errors.email;
    });

    const failed = results.filter(r => !r.ok).length;
    console.log(`\nИтог: ${results.length - failed} из ${results.length} тестов прошли.`);
}

window.addEventListener('load', () => {
    setTimeout(runTests, 100);
});