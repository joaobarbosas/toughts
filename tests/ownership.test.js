const test = require('node:test');
const assert = require('node:assert/strict');
const Tought = require('../models/Tought');
const controller = require('../controllers/ToughtController');
const conn = require('../db/conn');

test.after(() => conn.close());

test('edit form scopes the lookup to the authenticated owner', async (t) => {
  const find = t.mock.method(Tought, 'findOne', async () => null);
  let status;
  await controller.updateTought({ params: { id: '9' }, session: { userid: 2 } }, {
    sendStatus: (code) => { status = code; },
    render: () => assert.fail('Must not expose another user thought'),
  });
  assert.deepEqual(find.mock.calls[0].arguments[0].where, { id: '9', UserId: 2 });
  assert.equal(status, 404);
});

test('edit submission scopes update to owner and rejects missing rows', async (t) => {
  const update = t.mock.method(Tought, 'update', async () => [0]);
  let status;
  await controller.updateToughtSave({ body: { id: '9', title: 'changed' }, session: { userid: 2 } }, {
    sendStatus: (code) => { status = code; },
  });
  assert.deepEqual(update.mock.calls[0].arguments[1].where, { id: '9', UserId: 2 });
  assert.equal(status, 404);
});
