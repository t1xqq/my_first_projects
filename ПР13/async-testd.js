async function runAsyncTests() {
    const results = [];

    async function test(name, fn) {
        try {
            const ok = await fn();
            results.push({ name, ok });
            console.log(ok ? `✅ ${name}` : `❌ ${name}`);
        } catch (e) {
            results.push({ name, ok: false });
            console.error(`❌ ${name}: ${e.message}`);
        }
    }

    await test('createBasicPromise(true) резолвится', async () => {
        const result = await createBasicPromise(true);
        return result === 'Успех!';
    });

    await test('createBasicPromise(false) реджектится', async () => {
        try {
            await createBasicPromise(false);
            return false;
        } catch (e) {
            return e.message === 'Ошибка!';
        }
    });

    await test('delayWithPromise(50) резолвится через ~50мс', async () => {
        const start = Date.now();
        await delayWithPromise(50);
        const diff = Date.now() - start;
        return diff >= 40 && diff < 200;
    });

    await test('Promise.allSettled возвращает 3 результата', async () => {
        const p = [Promise.resolve(1), Promise.reject(new Error('x')), Promise.resolve(3)];
        const r = await Promise.allSettled(p);
        return r.length === 3;
    });

    await test('retryWithBackoff успешно со 2-й попытки', async () => {
        let attempts = 0;
        const fn = async () => {
            attempts++;
            if (attempts < 2) throw new Error('fail');
            return 'ok';
        };
        const result = await retryWithBackoff(fn, 3);
        return result === 'ok' && attempts === 2;
    });

    await test('retryWithBackoff бросает ошибку после maxRetries', async () => {
        const fn = async () => { throw new Error('always fail'); };
        try {
            await retryWithBackoff(fn, 2);
            return false;
        } catch (e) {
            return e.message === 'always fail';
        }
    });

    await test('createRequestCache использует кэш', async () => {
        let calls = 0;
        const mockFetch = async (url) => {
            calls++;
            return { ok: true, json: async () => ({ id: 1, url }) };
        };

        const originalFetch = window.fetch;
        window.fetch = mockFetch;
        try {
            const cachedFetch = createRequestCache();
            await cachedFetch('http://test.url');
            await cachedFetch('http://test.url');
            return calls === 1;
        } finally {
            window.fetch = originalFetch;
        }
    });

    const failed = results.filter(r => !r.ok).length;
    console.log(`\nИтог: ${results.length - failed} из ${results.length} тестов прошли.`);
}

window.addEventListener('load', () => {
    setTimeout(runAsyncTests, 100);
});