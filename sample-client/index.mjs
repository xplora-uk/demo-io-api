import { randomUUID as uuid } from 'node:crypto';
import WebSocket from 'ws';
import { pack, unpack } from 'msgpackr';

const ws = new WebSocket('ws://127.0.0.1:8080/');

const log = (...args) => console.log.apply(null, [new Date(), ...args]);

ws.on('error', log);

ws.on('open', function open() {
  const echoPayload = {
    meta: { cmd: 'echo', id: uuid(), ts: new Date() },
    data: { msg: 'hello' },
  };
  log('connected, sending data 1', echoPayload);
  ws.send(pack(echoPayload));

  const selectUserPayload = {
    meta: { cmd: 'select_user', id: uuid(), ts: new Date() },
    data: { criteria: { id: 1 }},
  };
  log('connected, sending data 2', selectUserPayload);
  ws.send(pack(selectUserPayload));

  const selectUsersPayload = {
    meta: { cmd: 'select_users', id: uuid(), ts: new Date() },
    data: { limit: 5, columns: ['id', 'rid', 'email_address', 'c_date'] },
  };
  log('connected, sending data 3', selectUsersPayload);
  ws.send(pack(selectUsersPayload));
});

ws.on('message', function message(payload) {
  //log('received raw', payload);
  log('received obj', unpack(payload));
});
