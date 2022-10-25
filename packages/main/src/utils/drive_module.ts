class Drive {
  nodeAddress: number = 0;
  startAddress: number = 0;
  ipAddress: number[] = [];
  totalInBytes: number = 2;
  totalOutBytes: number = 2;

  nextStartAddress(): number {
    let nextInAddress = this.startAddress + this.totalInBytes;
    let nextOutAddress = this.startAddress + this.totalOutBytes;
    return nextInAddress > nextOutAddress ? nextInAddress : nextOutAddress;
  }

  nextNodeAddress(): number {
    return this.nodeAddress + 1;
  }
}

export class ABBUMC100 extends Drive {
  name: string;
  description: string;
  type: string;
  partNumber: string = "1SAJ263000R0100";
  moduleType: string = "GSDML-V2.4-ABB-PNU32-20210223.xml<DAP_PNU32>";
  slot1: string = "UMC100.3";
  totalInBytes: number = 16;
  totalOutBytes: number = 12;
  nodeAddress: number;
  ioSubSystem: number;
  startAddress: number;
  ipAddress: number[];
  currentRating: number;

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    currentRating: number
  ) {
    super();
    this.name = name;
    this.description = description;
    this.type = type;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.currentRating = currentRating;
  }
}

export class ABBVFD extends Drive {
  name: string;
  description: string;
  type: string = "VFD";
  partNumber: string = "6438177287452";
  moduleType: string = "GSDML-V2.33-ABB-FENA-20170914.xml<FENA_DAP_V4>";
  slot1: string = "PPO Type 6";
  totalInBytes: number = 20;
  totalOutBytes: number = 20;
  nodeAddress: number;
  ioSubSystem: number;
  startAddress: number;
  ipAddress: number[];

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[]
  ) {
    super();
    this.name = name;
    this.description = description;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
  }

  getStartAddress(): number {
    let nextInAddress = this.startAddress + this.totalInBytes;
    let nextOutAddress = this.startAddress + this.totalOutBytes;
    return nextInAddress > nextOutAddress ? nextInAddress : nextOutAddress;
  }
}
