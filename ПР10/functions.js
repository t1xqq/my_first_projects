// Создайте функцию sum, которая принимает любое количество аргументов
// Используйте rest parameters для получения всех аргументов
function sum(...numbers) {
    // Используем метод reduce для суммирования всех элементов массива numbers
    // Начальное значение 0
    return numbers.reduce((total, num) => total + num, 0);
}

// Создайте функцию createUser, которая принимает объект с деструктуризацией
// Объект должен содержать: name, age, email (email - необязательный)
function createUser({ name, age, email = "не указан" }) {
    // Возвращаем отформатированную строку с использованием шаблонных литералов
    return `Пользователь: ${name}, возраст: ${age}, email: ${email}`;
}

// Создайте функцию secretMessage, которая сохраняет секретное сообщение
// и возвращает функцию для его проверки
function secretMessage(password, message) {
    // Возвращаем анонимную функцию (замыкание), которая "помнит" password и message
    return function(inputPassword) {
        // Проверяем, совпадает ли введенный пароль с сохраненным
        if (inputPassword === password) {
            return message;
        } else {
            return "Доступ запрещен";
        }
    };
}

// Создайте функцию compose, которая принимает несколько функций
// и возвращает их композицию (результат последовательного применения)
function compose(...functions) {
    // Возвращаем новую функцию, которая принимает аргументы
    return function(...args) {
        // Если функций нет, просто возвращаем первый аргумент
        if (functions.length === 0) {
            return args[0];
        }

        // Применяем функции справа налево (стандартная математическая композиция)
        // reduceRight идет от последнего элемента к первому
        return functions.reduceRight((result, fn) => fn(result), args[0]);

        // ПРИМЕЧАНИЕ: Если нужен порядок слева направо (как в pipe),
        // замените reduceRight на reduce и уберите args[0] в конце:
        // return functions.reduce((result, fn) => fn(result), args[0]);
    };
}

// Реализуйте функцию myMap, которая работает как Array.prototype.map
function myMap(array, callback) {
    // Создаем новый массив для результатов
    const result = [];

    // Проходим по каждому элементу исходного массива
    for (let i = 0; i < array.length; i++) {
        // Вызываем callback с элементом, индексом и самим массивом (как в оригинале)
        // и добавляем результат в новый массив
        result.push(callback(array[i], i, array));
    }

    return result;
}

// Реализуйте функцию myFilter, которая работает как Array.prototype.filter
function myFilter(array, callback) {
    // Создаем новый массив для отфильтрованных элементов
    const result = [];

    // Проходим по каждому элементу
    for (let i = 0; i < array.length; i++) {
        // Если callback возвращает true (или truthy значение),
        // добавляем элемент в результат
        if (callback(array[i], i, array)) {
            result.push(array[i]);
        }
    }

    return result;
}

// Реализуйте функцию myReduce, которая работает как Array.prototype.reduce
function myReduce(array, callback, initialValue) {
    let accumulator;
    let startIndex = 0;

    // Проверяем, передан ли initialValue (используем arguments.length для надежности)
    if (arguments.length >= 3) {
        // Если начальное значение передано, используем его
        accumulator = initialValue;
    } else {
        // Если не передано, берем первый элемент массива как начальное значение
        // и начинаем со второго элемента
        if (array.length === 0) {
            throw new TypeError('Reduce of empty array with no initial value');
        }
        accumulator = array[0];
        startIndex = 1;
    }

    // Проходим по массиву начиная с startIndex
    for (let i = startIndex; i < array.length; i++) {
        // Обновляем аккумулятор результатом вызова callback
        accumulator = callback(accumulator, array[i], i, array);
    }

    return accumulator;
}

// Каррирование
// Реализуйте функцию curry, которая превращает функцию от нескольких аргументов в цепочку функций
function curry(fn) {
    // Возвращаем функцию, которая собирает аргументы
    return function curried(...args) {
        // Если передано достаточно аргументов (>= чем ожидает fn), вызываем fn
        if (args.length >= fn.length) {
            return fn.apply(this, args);
        }
        // Иначе возвращаем новую функцию, которая продолжит собирать аргументы
        return function(...nextArgs) {
            return curried.apply(this, [...args, ...nextArgs]);
        };
    };
}

// Мемоизация
// Реализуйте функцию memoize, которая кэширует результаты вызовов функции
function memoize(fn) {
    // Используем Map для хранения кэша (ключ - аргументы, значение - результат)
    const cache = new Map();

    return function(...args) {
        // Создаем ключ из аргументов (JSON.stringify для сложных случаев)
        const key = JSON.stringify(args);

        // Если результат уже в кэше - возвращаем его
        if (cache.has(key)) {
            return cache.get(key);
        }

        // Иначе вычисляем результат, сохраняем и возвращаем
        const result = fn.apply(this, args);
        cache.set(key, result);
        return result;
    };
}

// Дебаунсинг
// Реализуйте функцию debounce, которая откладывает вызов функции
function debounce(fn, delay) {
    // Переменная для хранения ID таймера
    let timeoutId;

    return function(...args) {
        // Сохраняем контекст вызова
        const context = this;

        // Отменяем предыдущий таймер, если он был
        clearTimeout(timeoutId);

        // Устанавливаем новый таймер
        // Функция выполнится только если не будет вызвана снова в течение delay
        timeoutId = setTimeout(() => {
            fn.apply(context, args);
        }, delay);
    };
}

// Троттлинг
// Реализуйте функцию throttle, которая ограничивает частоту вызовов функции
function throttle(fn, interval) {
    // Флаг: можно ли сейчас вызвать функцию
    let canCall = true;

    return function(...args) {
        // Сохраняем контекст
        const context = this;

        // Если вызов разрешен
        if (canCall) {
            // Вызываем функцию
            fn.apply(context, args);
            // Блокируем вызовы
            canCall = false;

            // Разблокируем через interval миллисекунд
            setTimeout(() => {
                canCall = true;
            }, interval);
        }
    };
}

// Функция-валидатор
// Реализуйте функцию createValidator, которая возвращает функцию проверки
// Валидатор должен проверять: минимальную длину, наличие цифр, наличие заглавных букв
function createValidator(options) {
    // Деструктурируем опции с значениями по умолчанию
    const {
        minLength = 8,
        requireDigit = true,
        requireUppercase = true
    } = options;

    // Возвращаем функцию-валидатор
    return function(value) {
        const errors = [];

        // Проверка минимальной длины
        if (value.length < minLength) {
            errors.push(`Минимальная длина: ${minLength} символов`);
        }

        // Проверка наличия цифр (регулярное выражение \d)
        if (requireDigit && !/\d/.test(value)) {
            errors.push("Должна быть хотя бы одна цифра");
        }

        // Проверка наличия заглавных букв (регулярное выражение [A-Z] или [А-Я])
        if (requireUppercase && !/[A-ZА-Я]/.test(value)) {
            errors.push("Должна быть хотя бы одна заглавная буква");
        }

        // Возвращаем объект с результатом и списком ошибок
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    };
}