import WebSocketAsPromised from 'websocket-as-promised';

const ws = new WebSocketAsPromised('ws://localhost:3002', {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data as string)
});


export function open() {
  return ws.open();
}

export function isOpened() {
  return ws.isOpened;
}

export function  isOpening() {
  return ws.isOpening;
}

export function send(data: any) {
  ws.sendPacked(data);
}

export function addListener(callback: (...args: any[]) => any) {
  ws.onUnpackedMessage.addListener(callback);
}