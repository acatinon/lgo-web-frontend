import BigNumber from "bignumber.js"
import moment from "moment";

interface Operation {
    created_at: moment.Moment;
    type: string;
    quantity: BigNumber;
    status: string;
}