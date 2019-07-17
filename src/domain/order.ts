
export enum Side {
    Buy = "B",
    Sell = "S"
}

export enum OrderType {
    Market = "M",
    Limit = "L"
}

export enum OrderStatus {
    Open = "open",
    Pending = "pending",
    Canceled = "canceled",
    Filled = "filled",
    CanceledByAdministrator = "canceledbyadministrator",
    CanceledByOwner = "canceledbyowner"    
}
