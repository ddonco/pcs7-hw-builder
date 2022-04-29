export class ABBUMC100 {
  name: string;
  type: string;
  description: string;
  nodeAddress: number;
  ioSubsystem: number;
  inAddress: number;
  outAddress: number;
  currentRating: number;

  constructor(
    name: string,
    type: string,
    description: string,
    nodeAddress: number,
    ioSubsystem: number,
    inAddress: number,
    outAddress: number,
    currentRating: number
  ) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.nodeAddress = nodeAddress;
    this.ioSubsystem = ioSubsystem;
    this.inAddress = inAddress;
    this.outAddress = outAddress;
    this.currentRating = currentRating;
  }
}

export class ABBVFD {
  name: string;
  type: string;
  description: string;
  nodeAddress: number;
  ioSubsystem: number;
  inAddress: number;
  outAddress: number;

  constructor(
    name: string,
    type: string,
    description: string,
    nodeAddress: number,
    ioSubsystem: number,
    inAddress: number,
    outAddress: number
  ) {
    this.name = name;
    this.type = type;
    this.description = description;
    this.nodeAddress = nodeAddress;
    this.ioSubsystem = ioSubsystem;
    this.inAddress = inAddress;
    this.outAddress = outAddress;
  }
}
