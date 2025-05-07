
/// <reference types="vite/client" />

interface BluetoothDevice {
  id: string;
  name: string;
  gatt?: {
    connect: () => Promise<any>;
  };
}

interface BluetoothRemoteGATTCharacteristic {
  writeValue: (value: BufferSource) => Promise<void>;
}

interface BluetoothRemoteGATTService {
  getCharacteristic: (characteristic: BluetoothCharacteristicUUID) => Promise<BluetoothRemoteGATTCharacteristic>;
}

interface BluetoothRemoteGATTServer {
  connect: () => Promise<BluetoothRemoteGATTServer>;
  getPrimaryService: (service: BluetoothServiceUUID) => Promise<BluetoothRemoteGATTService>;
}

interface BluetoothDevice {
  gatt?: BluetoothRemoteGATTServer;
}

interface RequestDeviceOptions {
  filters?: Array<{
    services?: BluetoothServiceUUID[];
    name?: string;
    namePrefix?: string;
    manufacturerData?: Record<number, DataView>;
    serviceData?: Record<BluetoothServiceUUID, DataView>;
  }>;
  optionalServices?: BluetoothServiceUUID[];
  acceptAllDevices?: boolean;
}

interface Bluetooth {
  getAvailability: () => Promise<boolean>;
  requestDevice: (options?: RequestDeviceOptions) => Promise<BluetoothDevice>;
}

interface Navigator {
  bluetooth?: Bluetooth;
}

