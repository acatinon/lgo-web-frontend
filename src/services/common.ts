import WebSocketAsPromised from 'websocket-as-promised';

export const ws = new WebSocketAsPromised('ws://localhost:3002', {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
});
