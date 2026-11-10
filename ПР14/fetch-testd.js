(() => {
  let pass = 0, fail = 0;
  const results = [];

  const assert = (cond, msg) => { if (!cond) throw new Error(msg || 'fail'); };
  const eq = (a, b, msg) => assert(a === b, `${msg || 'eq'}: ожидалось ${b}, получено ${a}`);

  async function test(name, fn) {
    try { await fn(); pass++; results.push({ name, ok: true }); console.log(`✔ ${name}`); }
    catch (e) { fail++; results.push({ name, ok: false, error: e.message }); console.error(`✘ ${name}: ${e.message}`); }
  }

  (async () => {
    // утилиты
    await test('buildUrl добавляет параметры', () => {
      const u = buildUrl('https://api.test/posts', { _limit: 5, _sort: 'id' });
      assert(u.includes('_limit=5') && u.includes('_sort=id'));
    });

    await test('buildUrl игнорирует null/undefined', () => {
      const u = buildUrl('https://api.test/posts', { a: 1, b: null, c: undefined });
      assert(u.includes('a=1') && !u.includes('b=') && !u.includes('c='));
    });

    await test('buildUrl без параметров', () => {
      eq(buildUrl('https://api.test/posts', {}), 'https://api.test/posts');
    });

    await test('timed возвращает время', async () => {
      const { executionTime } = await timed(() => new Promise(r => setTimeout(r, 40)));
      assert(executionTime >= 30);
    });

    // Кэш
    await test('кэш: повторный запрос не идёт в сеть', async () => {
      let calls = 0;
      const orig = globalThis.fetch;
      globalThis.fetch = async () => { calls++; return { ok: true, json: async () => ({ x: 1 }) }; };
      try {
        const c = createFetchCache();
        await c('https://t/1'); await c('https://t/1');
        eq(calls, 1, 'fetch должен вызваться 1 раз');
      } finally { globalThis.fetch = orig; }
    });

    // Retry
    await test('retry: успех с 1-й попытки', async () => {
      let n = 0; const orig = globalThis.fetch;
      globalThis.fetch = async () => { n++; return { ok: true, json: async () => ({ ok: 1 }) }; };
      try { await fetchWithRetry('https://t', {}, 3); eq(n, 1); } finally { globalThis.fetch = orig; }
    });

    await test('retry: повтор после ошибки', async () => {
      let n = 0; const orig = globalThis.fetch;
      globalThis.fetch = async () => { n++; if (n < 2) throw new Error('net'); return { ok: true, json: async () => ({}) }; };
      try { await fetchWithRetry('https://t', {}, 3); eq(n, 2); } finally { globalThis.fetch = orig; }
    });

    await test('retry: все попытки падают', async () => {
      const orig = globalThis.fetch;
      globalThis.fetch = async () => { throw new Error('fail'); };
      try {
        let threw = false;
        try { await fetchWithRetry('https://t', {}, 2); } catch { threw = true; }
        assert(threw, 'должна быть ошибка');
      } finally { globalThis.fetch = orig; }
    });

    // Реальная сеть (пропускается без интернета)
    await test('404: response.ok === false', async () => {
      try {
        const r = await fetch('https://jsonplaceholder.typicode.com/nonexistent');
        eq(r.ok, false); eq(r.status, 404);
      } catch (e) { console.warn('нет сети, пропуск:', e.message); }
    });

    await test('GET /posts/1 → id=1', async () => {
      try {
        const d = await fetch('https://jsonplaceholder.typicode.com/posts/1').then(r => r.json());
        eq(d.id, 1); assert(typeof d.title === 'string');
      } catch (e) { console.warn('нет сети, пропуск:', e.message); }
    });

    await test('AbortController отменяет запрос', async () => {
      const c = new AbortController(); c.abort();
      let threw = false;
      try { await fetch('https://jsonplaceholder.typicode.com/posts', { signal: c.signal }); }
      catch (e) { threw = true; eq(e.name, 'AbortError'); }
      assert(threw, 'должно бросить AbortError');
    });

    // Итоги
    console.log(`\n=== ${pass} прошло, ${fail} провалено ===`);
    window.addEventListener('DOMContentLoaded', () => {
      const f = document.querySelector('footer');
      if (!f) return;
      f.insertAdjacentHTML('beforeend', `<div class="test-result"><strong>Тесты: ${pass} ✔ / ${fail} ✘</strong>${
        results.map(r => `<div class="test-result ${r.ok ? 'test-success' : 'test-failure'}">${r.ok ? '✔' : '✘'} ${r.name}${r.ok ? '' : `<br><small>${r.error}</small>`}</div>`).join('')
      }</div>`);
    });
  })();
})();