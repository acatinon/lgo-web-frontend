export function listen(observer: Observer<DescriptorEvent<Descriptor>>): Subscription;
export function open(descriptor: Descriptor, timeout?: number): Promise<Transport<Descriptor>>


declare type Descriptor = any;
declare type Transport<Descriptor> = any;

declare class Observer<Ev> {
    next: (event: Ev) => any;
    error: (e: any) => any;
    complete: () => any;
}

declare class DescriptorEvent<Desc extends Descriptor> {
    type: "add" | "remove";
    descriptor: Desc;
    deviceModel?: DeviceModel;
    device?: Object
}

declare class Subscription {
    unsubscribe(): void;
}

declare class DeviceModel {
    id: any;
    productName: string;
    productIdMM: number;
    legacyUsbProductId: number;
    usbOnly: boolean;
    bluetoothSpec?: Array<{
      serviceUuid: string,
      writeUuid: string,
      notifyUuid: string
    }>
}