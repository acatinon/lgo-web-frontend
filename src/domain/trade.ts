import { Side } from "./order"
import BigNumber from "bignumber.js"
import moment from "moment";

export interface Trade {
    id: string;  
    product_id: string;  
    quantity: BigNumber;  
    price: BigNumber;
    fees: BigNumber;
    creation_date: moment.Moment;
    side: Side;
    order_id: string;
    liquidity: Liquidity;
}

export enum Liquidity {
    Taker = "T",
    Maker = "M" 
}