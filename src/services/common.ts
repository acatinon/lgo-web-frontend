import WebSocketAsPromised from 'websocket-as-promised';

const ws = new WebSocketAsPromised('ws://localhost:3002', {
  packMessage: data => JSON.stringify(data),
  unpackMessage: data => JSON.parse(data)
});


export function  open() {
  return ws.open();
}

export function subscribe(productId: string) {
  ws.sendPacked({
    type: "subscribe",
    channels: [
      {
        name: "user",
        product_id: productId
      }
    ]
  });
}

export function unsubscribe(productId: string) {
  ws.sendPacked({
    type: "unsubscribe",
    channels: [
      {
        name: "user",
        product_id: productId
      }
    ]
  });
}

export function addListener(callback: (...args: any[]) => any) {
  ws.onUnpackedMessage.addListener(callback);
}