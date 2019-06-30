import WebSocketAsPromised from 'websocket-as-promised';

export enum Side {
    Buy = "B",
    Sell = "S"
}

export enum Type {
    Market = "M",
    Limit = "L"
}

export const ws = new WebSocketAsPromised('ws://localhost:3002');