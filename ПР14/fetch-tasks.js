const API_BASE_URL = 'https://jsonplaceholder.typicode.com';

// утилиты

const $ = id => document.getElementById(id);

function out(id, data, isError = false) {
  const el = $(id);
  if (!el) return;
  const ts = new Date().toLocaleTimeString();
  let content = data instanceof Error ? `Ошибка: ${data.message}`
    : typeof data === 'object' && data !== null ? JSON.stringify(data, null, 2)
    : String(data);
  el.textContent = `[${ts}] ${content}`;
  el.className = `output ${isError ? 'error' : 'success'}`;
}

function showData(id, data) {
  const c = $(id);
  if (!c) return;
  if (Array.isArray(data))
    c.innerHTML = data.map(i => `<div class="user-card"><h4>${i.name || i.title || '—'}</h4><p>Email: ${i.email || '—'}</p><p>${i.body || i.phone || ''}</p></div>`).join('');
  else if (typeof data === 'object' && data !== null)
    c.innerHTML = `<div class="json-view">${JSON.stringify(data, null, 2)}</div>`;
  else c.innerHTML = `<p>${data}</p>`;
}

function loading(id, on) {
  const b = $(id);
  if (!b) return;
  if (on) { b.disabled = true; b.innerHTML = '<span class="spinner"></span> Загрузка...'; }
  else { b.disabled = false; b.innerHTML = b.dataset.original || b.textContent; }
}

const buildUrl = (base, params = {}) => {
  const u = new URL(base);
  Object.entries(params).forEach(([k, v]) => v != null && u.searchParams.append(k, v));
  return u.toString();
};

async function timed(fn) {
  const s = Date.now();
  const result = await fn();
  return { result, executionTime: Date.now() - s };
}

async function withBtn(id, fn) {
  loading(id, true);
  try { await fn(); } catch (e) { console.error(e); } finally { loading(id, false); }
}

// get
async function fetchGetRequest() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    out('get-output', d); showData('get-data', d);
  } catch (e) { out('get-output', e, true); }
}

async function fetchJsonData() {
  try {
    const r = await fetch(`${API_BASE_URL}/users`);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const users = await r.json();
    out('get-output', `Пользователей: ${users.length}`);
    showData('get-data', users.slice(0, 5));
  } catch (e) { out('get-output', e, true); }
}

async function fetchWithError() {
  try {
    const r = await fetch(`${API_BASE_URL}/nonexistent`);
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  } catch (e) {
    out('get-output', `Поймано: ${e.message}\nfetch НЕ reject-ит на 404 — проверяй response.ok.`, true);
  }
}

function setupGetRequests() {
  $('fetch-get')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchGetRequest));
  $('fetch-json')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchJsonData));
  $('fetch-error')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithError));
}

// crud
async function fetchPostRequest() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Новый', body: 'Текст', userId: 1 })
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('crud-output', { status: r.status, data: await r.json() });
  } catch (e) { out('crud-output', e, true); }
}

async function fetchPutRequest() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: 1, title: 'Заменён', body: 'Новое', userId: 1 })
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('crud-output', { status: r.status, data: await r.json() });
  } catch (e) { out('crud-output', e, true); }
}

async function fetchPatchRequest() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Только заголовок' })
    });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('crud-output', { status: r.status, data: await r.json(), note: 'PATCH меняет только переданное, PUT — весь ресурс' });
  } catch (e) { out('crud-output', e, true); }
}

async function fetchDeleteRequest() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`, { method: 'DELETE' });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('crud-output', `Удалено. Статус: ${r.status}`);
  } catch (e) { out('crud-output', e, true); }
}

function setupCrudRequests() {
  $('fetch-post')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchPostRequest));
  $('fetch-put')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchPutRequest));
  $('fetch-patch')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchPatchRequest));
  $('fetch-delete')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchDeleteRequest));
}

// заголовки и параметры
async function fetchWithHeaders() {
  try {
    const headers = { 'Content-Type': 'application/json', 'X-Custom-Header': 'MyValue', 'Authorization': 'Bearer test-token' };
    const r = await fetch(`${API_BASE_URL}/posts`, { headers });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    out('headers-output', `Отправлено:\n${JSON.stringify(headers, null, 2)}\nПостов: ${d.length}`);
  } catch (e) { out('headers-output', e, true); }
}

async function fetchWithAuth() {
  try {
    const basic = btoa('user:pass');
    const r = await fetch(`${API_BASE_URL}/posts/1`, { headers: { Authorization: `Basic ${basic}` } });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('headers-output', `Basic: Authorization: Basic ${basic}\nBearer: Authorization: Bearer <token>\nОтвет: ${JSON.stringify(await r.json()).slice(0, 150)}...`);
  } catch (e) { out('headers-output', e, true); }
}

async function fetchWithParams() {
  try {
    const url = buildUrl(`${API_BASE_URL}/posts`, { _limit: 5, _sort: 'id', _order: 'desc' });
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const d = await r.json();
    out('headers-output', `URL: ${url}\nid: ${d.map(p => p.id).join(', ')}`);
    showData('get-data', d);
  } catch (e) { out('headers-output', e, true); }
}

async function fetchWithTimeout() {
  const c = new AbortController();
  const t = setTimeout(() => c.abort(), 3000);
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`, { signal: c.signal });
    clearTimeout(t);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('headers-output', `Успех: ${JSON.stringify(await r.json()).slice(0, 100)}...`);
  } catch (e) {
    clearTimeout(t);
    out('headers-output', e.name === 'AbortError' ? 'Отменено по таймауту (AbortError)' : e.message, true);
  }
}

function setupHeadersAndParams() {
  $('fetch-headers')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithHeaders));
  $('fetch-auth')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithAuth));
  $('fetch-params')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithParams));
  $('fetch-timeout')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithTimeout));
}

// отработка ответов
async function fetchAndCheckStatus() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`);
    out('response-output', `ok=${r.ok}, status=${r.status}, statusText="${r.statusText}"`);
    if (!r.ok) throw new Error(`Плохой статус ${r.status}`);
    showData('response-data', await r.json());
  } catch (e) { out('response-output', e, true); }
}

async function fetchAndReadHeaders() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/1`);
    const h = {};
    r.headers.forEach((v, k) => h[k] = v);
    out('response-output', `Все заголовки:\n${JSON.stringify(h, null, 2)}\n\nContent-Type: ${r.headers.get('content-type')}\nDate: ${r.headers.get('date')}`);
  } catch (e) { out('response-output', e, true); }
}

async function fetchBlobData() {
  try {
    const r = await fetch('https://picsum.photos/200/300');
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const blob = await r.blob();
    out('response-output', `Blob: type=${blob.type}, size=${blob.size}`);
    $('response-data').innerHTML = `<img src="${URL.createObjectURL(blob)}" style="max-width:100%;border-radius:8px">`;
  } catch (e) { out('response-output', e, true); }
}

async function fetchWithFormData() {
  try {
    const fd = new FormData();
    fd.append('title', 'Через FormData');
    fd.append('body', 'multipart');
    fd.append('userId', '1');
    const r = await fetch(`${API_BASE_URL}/posts`, { method: 'POST', body: fd });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('response-output', `FormData → multipart/form-data (файлы + поля). JSON → application/json.\nСтатус: ${r.status}\n${JSON.stringify(await r.json())}`);
  } catch (e) { out('response-output', e, true); }
}

function setupResponseHandling() {
  $('fetch-status')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchAndCheckStatus));
  $('fetch-headers-response')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchAndReadHeaders));
  $('fetch-blob')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchBlobData));
  $('fetch-formdata')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithFormData));
}

// ошибки
async function fetchNetworkError() {
  try {
    await fetch('https://this-domain-does-not-exist-xyz123.com/');
  } catch (e) {
    out('error-output', `СЕТЕВАЯ ошибка: ${e.message}\nname=${e.name}\n(fetch reject только при сетевых сбоях)`, true);
  }
}

async function fetchHttpError() {
  try {
    const r = await fetch(`${API_BASE_URL}/posts/999999`);
    if (!r.ok) throw new Error(`HTTP ${r.status} ${r.statusText}`);
  } catch (e) {
    out('error-output', `HTTP ошибка: ${e.message}\n(4xx/5xx не reject — проверяй response.ok)`, true);
  }
}

let abortCtrl = null;
async function fetchWithAbort() {
  if (abortCtrl) { abortCtrl.abort(); abortCtrl = null; return; }
  abortCtrl = new AbortController();
  out('error-output', 'Запрос пошёл, нажми кнопку снова для отмены...');
  try {
    const r = await fetch('https://httpbin.org/delay/5', { signal: abortCtrl.signal });
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    out('error-output', 'Завершено без отмены');
  } catch (e) {
    out('error-output', e.name === 'AbortError' ? 'Отменено (AbortError)' : e.message, true);
  } finally { abortCtrl = null; }
}

async function fetchWithRetry(url, options = {}, retries = 3) {
  let last;
  for (let i = 1; i <= retries; i++) {
    try {
      const r = await fetch(url, options);
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return await r.json();
    } catch (e) {
      last = e;
      if (i < retries) {
        const delay = 2 ** i * 200;
        out('error-output', `Попытка ${i}: ${e.message}. Повтор через ${delay} мс...`, true);
        await new Promise(r => setTimeout(r, delay));
      }
    }
  }
  throw last;
}

function setupErrorHandling() {
  $('fetch-network-error')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchNetworkError));
  $('fetch-http-error')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchHttpError));
  $('fetch-abort')?.addEventListener('click', fetchWithAbort);
  $('fetch-retry')?.addEventListener('click', async () => {
    try {
      const d = await fetchWithRetry(`${API_BASE_URL}/posts/1`, {}, 3);
      out('error-output', `Успех: ${JSON.stringify(d).slice(0, 120)}...`);
    } catch (e) { out('error-output', `Все попытки провалились: ${e.message}`, true); }
  });
}

// параллельные
async function fetchWithPromiseAll() {
  try {
    const { result, executionTime } = await timed(() => Promise.all([
      fetch(`${API_BASE_URL}/posts?_limit=3`).then(r => r.json()),
      fetch(`${API_BASE_URL}/users?_limit=3`).then(r => r.json()),
      fetch(`${API_BASE_URL}/comments?_limit=3`).then(r => r.json())
    ]));
    out('parallel-output', `Promise.all за ${executionTime} мс\nPosts: ${result[0].length}, Users: ${result[1].length}, Comments: ${result[2].length}`);
    showData('parallel-data', { posts: result[0], users: result[1], comments: result[2] });
  } catch (e) { out('parallel-output', e, true); }
}

async function fetchWithPromiseRace() {
  try {
    const { result, executionTime } = await timed(() => Promise.race([
      fetch(`${API_BASE_URL}/posts/1`).then(r => r.json()).then(d => ({ src: 'posts/1', d })),
      fetch(`${API_BASE_URL}/users/1`).then(r => r.json()).then(d => ({ src: 'users/1', d })),
      fetch(`${API_BASE_URL}/todos/1`).then(r => r.json()).then(d => ({ src: 'todos/1', d }))
    ]));
    out('parallel-output', `Победитель: ${result.src} за ${executionTime} мс\n${JSON.stringify(result.d).slice(0, 150)}...`);
  } catch (e) { out('parallel-output', e, true); }
}

async function fetchSequentialRequests() {
  try {
    const { result, executionTime } = await timed(async () => {
      const post = await fetch(`${API_BASE_URL}/posts/1`).then(r => r.json());
      const user = await fetch(`${API_BASE_URL}/users/${post.userId}`).then(r => r.json());
      const comments = await fetch(`${API_BASE_URL}/posts/${post.id}/comments`).then(r => r.json());
      return { post, user, comments };
    });
    out('parallel-output', `Последовательно за ${executionTime} мс (медленнее Promise.all)\nАвтор: ${result.user.name}, комментов: ${result.comments.length}`);
    showData('parallel-data', result);
  } catch (e) { out('parallel-output', e, true); }
}

function setupParallelRequests() {
  $('fetch-promise-all')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithPromiseAll));
  $('fetch-promise-race')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithPromiseRace));
  $('fetch-sequential')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchSequentialRequests));
}

// реальные сценарии
async function fetchUserWithPosts() {
  try {
    const id = 1;
    const [user, posts] = await Promise.all([
      fetch(`${API_BASE_URL}/users/${id}`).then(r => r.json()),
      fetch(`${API_BASE_URL}/posts?userId=${id}`).then(r => r.json())
    ]);
    out('real-output', `${user.name} (${user.email}), постов: ${posts.length}`);
    $('real-data').innerHTML = `<div class="user-card"><h4>${user.name}</h4><p>${user.email}</p><p>${user.address.city}</p></div>` +
      posts.slice(0, 5).map(p => `<div class="post-card"><h4>${p.title}</h4><p>${p.body}</p></div>`).join('');
  } catch (e) { out('real-output', e, true); }
}

async function fetchWithSearch() {
  try {
    const q = 'qui';
    const all = await fetch(`${API_BASE_URL}/posts`).then(r => r.json());
    const found = all.filter(p => (p.title + p.body).toLowerCase().includes(q));
    out('real-output', `Поиск "${q}": ${found.length}`);
    showData('real-data', found.slice(0, 5));
  } catch (e) { out('real-output', e, true); }
}

function simulateFileUpload() {
  const blob = new Blob(['a'.repeat(50 * 1024)], { type: 'text/plain' });
  const fd = new FormData();
  fd.append('file', blob, 'test.txt');
  $('real-data').innerHTML = `<div class="progress-bar"><div class="progress-fill" id="up-p"></div></div><div id="up-s">Отправка...</div>`;
  const xhr = new XMLHttpRequest();
  xhr.open('POST', 'https://httpbin.org/post');
  xhr.upload.onprogress = e => e.lengthComputable && ($('up-p').style.width = (e.loaded / e.total * 100) + '%');
  xhr.onload = () => { $('up-s').textContent = `Готово: ${xhr.status}`; out('real-output', `Загружено ${blob.size} байт, статус ${xhr.status}`); };
  xhr.onerror = () => { $('up-s').textContent = 'Ошибка'; out('real-output', 'Ошибка загрузки', true); };
  xhr.send(fd);
}

function createFetchCache() {
  const cache = new Map();
  const TTL = 30000;
  return async (url, options = {}) => {
    const now = Date.now();
    if (cache.has(url) && now - cache.get(url).ts < TTL)
      return { fromCache: true, data: cache.get(url).data };
    const r = await fetch(url, options);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    const data = await r.json();
    cache.set(url, { data, ts: now });
    return { fromCache: false, data };
  };
}
const cachedFetch = createFetchCache();

function setupRealScenarios() {
  $('fetch-user-posts')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchUserWithPosts));
  $('fetch-search')?.addEventListener('click', e => withBtn(e.currentTarget.id, fetchWithSearch));
  $('fetch-upload')?.addEventListener('click', simulateFileUpload);
  $('fetch-cache')?.addEventListener('click', async () => {
    try {
      const r1 = await cachedFetch(`${API_BASE_URL}/posts/1`);
      const r2 = await cachedFetch(`${API_BASE_URL}/posts/1`);
      out('real-output', `1-й: fromCache=${r1.fromCache}\n2-й: fromCache=${r2.fromCache}\n(2-й из кэша, TTL 30 с)`);
    } catch (e) { out('real-output', e, true); }
  });
}

// инициализация
function initializeFetchAPI() {
  setupGetRequests();
  setupCrudRequests();
  setupHeadersAndParams();
  setupResponseHandling();
  setupErrorHandling();
  setupParallelRequests();
  setupRealScenarios();
  document.querySelectorAll('button').forEach(b => b.dataset.original = b.textContent);
  console.log('Fetch API готов');
}

if (document.readyState === 'loading')
  document.addEventListener('DOMContentLoaded', initializeFetchAPI);
else initializeFetchAPI();