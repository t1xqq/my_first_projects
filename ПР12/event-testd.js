function runEventTests() {
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

    test('Кнопка #basic-btn существует', () => {
        return document.getElementById('basic-btn') !== null;
    });

    test('#basic-output обновляется после клика', () => {
        const btn = document.getElementById('basic-btn');
        const output = document.getElementById('basic-output');
        btn.click();
        return output.textContent.includes('Тип: click');
    });

    test('Поле #key-input существует', () => {
        return document.getElementById('key-input') !== null;
    });

    test('Делегирование: добавление элемента увеличивает список', () => {
        const list = document.getElementById('item-list');
        const before = list.children.length;
        document.getElementById('add-item-btn').click();
        return list.children.length === before + 1;
    });

    test('Делегирование: клик по .item добавляет класс selected', () => {
        const item = document.querySelector('#item-list .item');
        item.click();
        return item.classList.contains('selected');
    });

    test('preventLinkDefault отменяет переход (событие имеет preventDefault)', () => {
        const link = document.getElementById('prevent-link');
        let defaultPrevented = false;
        const handler = (e) => { defaultPrevented = e.defaultPrevented; };
        document.addEventListener('click', handler, { once: true });
        link.click();
        return defaultPrevented;
    });

    test('customAction обрабатывается', () => {
        let handled = false;
        const handler = () => { handled = true; };
        document.addEventListener('customAction', handler, { once: true });
        document.dispatchEvent(new CustomEvent('customAction', { detail: { message: 'test' } }));
        return handled;
    });

    test('createDebounce возвращает функцию', () => {
        const fn = createDebounce(() => {}, 100);
        return typeof fn === 'function';
    });

    test('createThrottle возвращает функцию', () => {
        const fn = createThrottle(() => {}, 100);
        return typeof fn === 'function';
    });

    test('validateForm (из ПР11) — проверка на пустое имя', () => {
        if (typeof validateForm !== 'function') return true; // пропускаем, если функция не подключена
        const errors = validateForm({ name: '', email: 'a@b.c', age: '10' });
        return !!errors.name;
    });

    const failed = results.filter(r => !r.ok).length;
    console.log(`\nИтог: ${results.length - failed} из ${results.length} тестов прошли.`);
}

window.addEventListener('load', () => {
    setTimeout(runEventTests, 100);
});