/*ЧАСТЬ 2.1 — ФУНКЦИИ ДЛЯ РАБОТЫ С ЧИСЛАМИ*/

// Временная сложность: O(√n) — субкорневая (лучше O(n))
function isPrime(number) {
    if (number <= 1) return false;
    if (number === 2) return true;
    if (number % 2 === 0) return false;
    for (let i = 3; i * i <= number; i += 2) {
        if (number % i === 0) return false;
    }
    return true;
}

// Временная сложность: O(n) — линейная
function factorial(n) {
    if (n < 0) return null;
    let result = 1;
    for (let i = 2; i <= n; i++) {
        result *= i;
    }
    return result;
}

// Временная сложность: O(n) — линейная
function fibonacci(n) {
    if (n <= 0) return [];
    if (n === 1) return [0];
    const result = [0, 1];
    for (let i = 2; i < n; i++) {
        result.push(result[i - 1] + result[i - 2]);
    }
    return result;
}

// Временная сложность: O(log(min(a, b))) — логарифмическая
// Алгоритм Евклида
function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b !== 0) {
        [a, b] = [b, a % b];
    }
    return a;
}

/* ЧАСТЬ 2.2 — ФУНКЦИИ ДЛЯ РАБОТЫ СО СТРОКАМИ*/

// Временная сложность: O(n) — линейная
function isPalindrome(str) {
    const cleaned = str.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');
    let left = 0;
    let right = cleaned.length - 1;
    while (left < right) {
        if (cleaned[left] !== cleaned[right]) return false;
        left++;
        right--;
    }
    return true;
}

// Временная сложность: O(n) — линейная
function countVowels(str) {
    const vowels = 'аеёиоуыэюяaeiou';
    let count = 0;
    for (const char of str.toLowerCase()) {
        if (vowels.includes(char)) count++;
    }
    return count;
}

// Временная сложность: O(n) — линейная
// Без использования split/reverse/join
function reverseString(str) {
    let result = '';
    for (let i = str.length - 1; i >= 0; i--) {
        result += str[i];
    }
    return result;
}

// Временная сложность: O(n) — линейная
function findLongestWord(sentence) {
    const words = sentence.split(/\s+/);
    let longest = '';
    for (const word of words) {
        const clean = word.replace(/[^\wа-яё]/gi, '');
        if (clean.length > longest.length) {
            longest = clean;
        }
    }
    return longest;
}

/*ЧАСТЬ 2.3 — ФУНКЦИИ ДЛЯ РАБОТЫ С МАССИВАМИ */

// Временная сложность: O(n) — линейная
// Без Math.max
function findMax(arr) {
    if (!arr || arr.length === 0) return undefined;
    let max = arr[0];
    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) max = arr[i];
    }
    return max;
}

// Временная сложность: O(n) — линейная (за счёт Set)
function removeDuplicates(arr) {
    return [...new Set(arr)];
}

// Временная сложность: O(n²) — квадратичная
function bubbleSort(arr) {
    const result = [...arr];
    const n = result.length;
    for (let i = 0; i < n - 1; i++) {
        let swapped = false;
        for (let j = 0; j < n - 1 - i; j++) {
            if (result[j] > result[j + 1]) {
                [result[j], result[j + 1]] = [result[j + 1], result[j]];
                swapped = true;
            }
        }
        if (!swapped) break; // оптимизация: массив уже отсортирован
    }
    return result;
}

// Временная сложность: O(log n) — логарифмическая
function binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (sortedArr[mid] === target) return mid;
        if (sortedArr[mid] < target) left = mid + 1;
        else right = mid - 1;
    }
    return -1;
}

/* ЧАСТЬ 2.4 — УТИЛИТАРНЫЕ ФУНКЦИИ*/

// Временная сложность: O(n) — линейная (зависит от длины строки)
function formatCurrency(amount, currency = '₽') {
    const fixed = amount.toFixed(2);
    const [intPart, decPart] = fixed.split('.');
    const spaced = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${spaced}.${decPart} ${currency}`;
}

// Временная сложность: O(n) — линейная (по длине email)
function isValidEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    return regex.test(email);
}

// Временная сложность: O(length) — линейная
function generatePassword(length = 8) {
    const lower   = 'abcdefghijklmnopqrstuvwxyz';
    const upper   = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const digits  = '0123456789';
    const special = '!@#$%^&*()_+-=[]{}|;:,.<>?';
    const all = lower + upper + digits + special;

    // Гарантируем наличие каждого типа символов
    let password = '';
    password += lower[Math.floor(Math.random() * lower.length)];
    password += upper[Math.floor(Math.random() * upper.length)];
    password += digits[Math.floor(Math.random() * digits.length)];
    password += special[Math.floor(Math.random() * special.length)];

    for (let i = password.length; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    // Перемешивание (Fisher–Yates)
    const arr = password.split('');
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.join('');
}