const test = require('node:test');
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const { once } = require('node:events');
const { setTimeout: delay } = require('node:timers/promises');

test('MySQL: registration, login, CRUD and cross-user authorization', {
  skip: process.env.RUN_MYSQL_TESTS !== '1', timeout: 30000,
}, async (t) => {
  const port = 3109;
  const child = spawn(process.execPath, ['index.js'], {
    env: { ...process.env, PORT: String(port), HOST: '127.0.0.1' }, stdio: 'pipe',
  });
  t.after(async () => { child.kill(); await once(child, 'exit'); });
  const base = `http://127.0.0.1:${port}`;
  let ready = false;
  for (let i = 0; i < 100; i++) {
    try { if ((await fetch(base)).ok) { ready = true; break; } } catch {}
    await delay(100);
  }
  assert.ok(ready, 'Application must start and connect to the test database');
  const request = async (path, body, cookie) => {
    const headers = {};
    if (cookie) headers.Cookie = cookie;
    if (body) headers['Content-Type'] = 'application/x-www-form-urlencoded';
    return fetch(base + path, {
      method: body ? 'POST' : 'GET', headers,
      body: body ? new URLSearchParams(body) : undefined, redirect: 'manual',
    });
  };
  const suffix = `${Date.now()}-${process.pid}`;
  const credentials = { name: 'Test user', email: `test-${suffix}@example.invalid`,
    password: 'local-test-only-password', confirmpassword: 'local-test-only-password' };
  let response = await request('/register', credentials);
  assert.equal(response.status, 302);
  const firstCookie = response.headers.get('set-cookie').split(';')[0];
  response = await request('/toughts/add', { title: `Test thought ${suffix}` }, firstCookie);
  assert.equal(response.status, 302);
  const dashboard = await (await request('/toughts/dashboard', null, firstCookie)).text();
  const id = dashboard.match(/\/toughts\/edit\/(\d+)/)?.[1];
  assert.ok(id, 'Created thought must appear on the dashboard');
  response = await request('/register', { ...credentials, email: `second-${suffix}@example.invalid` });
  const secondCookie = response.headers.get('set-cookie').split(';')[0];
  assert.equal((await request(`/toughts/edit/${id}`, null, secondCookie)).status, 404);
  assert.equal((await request('/toughts/edit', { id, title: 'Unauthorized edit' }, secondCookie)).status, 404);
  assert.equal((await request('/toughts/edit', { id, title: 'Updated thought' }, firstCookie)).status, 302);
  assert.match(await (await request(`/toughts/edit/${id}`, null, firstCookie)).text(), /Updated thought/);
  response = await request('/login', { email: credentials.email, password: credentials.password });
  assert.equal(response.status, 302);
  const loginCookie = response.headers.get('set-cookie').split(';')[0];
  assert.equal((await request('/toughts/remove', { id }, loginCookie)).status, 302);
  assert.equal((await request(`/toughts/edit/${id}`, null, loginCookie)).status, 404);
  assert.equal((await request('/toughts/dashboard')).status, 302);
});
