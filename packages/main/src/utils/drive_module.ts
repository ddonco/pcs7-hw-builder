export class Drive {
  name: string = "";
  description: string = "";
  type: string = "";
  nodeAddress: number = 0;
  ioSubSystem: number = 100;
  startAddress: number = 0;
  ipAddress: number[] = [];
  totalInBytes: number = 2;
  totalOutBytes: number = 2;
  telegramType: string = "";
  currentRating: number = 0;
  mcc: string = "";

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    telegramType: string,
    currentRating: number,
    mcc: string
  ) {
    this.name = name;
    this.description = description;
    this.type = type;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.telegramType = telegramType;
    this.currentRating = currentRating;
    this.mcc = mcc;
  }

  nextStartAddress(): number {
    const nextInAddress = this.startAddress + this.totalInBytes;
    const nextOutAddress = this.startAddress + this.totalOutBytes;
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
  mcc: string;

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    telegramType: string,
    currentRating: number,
    mcc: string
  ) {
    super(
      name,
      description,
      nodeAddress,
      ioSubSystem,
      startAddress,
      ipAddress,
      type,
      telegramType,
      currentRating,
      mcc
    );
    this.name = name;
    this.description = description;
    this.type = type;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.currentRating = currentRating;
    this.mcc = mcc;
  }
}

export class ABBVFD extends Drive {
  name: string;
  description: string;
  type: string;
  partNumber: string = "6438177287452";
  moduleType: string = "GSDML-V2.33-ABB-FENA-20170914.xml<FENA_DAP_V4>";
  slot1: string = "PPO Type 6";
  totalInBytes: number = 20;
  totalOutBytes: number = 20;
  nodeAddress: number;
  ioSubSystem: number;
  startAddress: number;
  ipAddress: number[];
  currentRating: number;
  mcc: string;

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    telegramType: string,
    currentRating: number,
    mcc: string
  ) {
    super(
      name,
      description,
      nodeAddress,
      ioSubSystem,
      startAddress,
      ipAddress,
      type,
      telegramType,
      currentRating,
      mcc
    );
    this.name = name;
    this.description = description;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.type = type;
    this.currentRating = currentRating;
    this.mcc = mcc;
  }

  getStartAddress(): number {
    const nextInAddress = this.startAddress + this.totalInBytes;
    const nextOutAddress = this.startAddress + this.totalOutBytes;
    return nextInAddress > nextOutAddress ? nextInAddress : nextOutAddress;
  }
}

export class SIEMENSS120 extends Drive {
  name: string;
  description: string;
  type: string;
  partNumber: string = "";
  moduleType: string =
    "GSDML-V2.34-Siemens-Sinamics_S_CU3x0-20220506.xml<IDD_CU320PN-V5.2>";
  slot1: string = "DO Control Unit";
  slot1SubType: string;
  slot1XmlVersion: string = "";
  totalInBytes: number = 8;
  totalOutBytes: number = 8;
  nodeAddress: number;
  ioSubSystem: number;
  startAddress: number;
  ipAddress: number[];
  currentRating: number;
  mcc: string;

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    telegramType: string,
    currentRating: number,
    mcc: string
  ) {
    super(
      name,
      description,
      nodeAddress,
      ioSubSystem,
      startAddress,
      ipAddress,
      type,
      telegramType,
      currentRating,
      mcc
    );
    this.name = name;
    this.description = description;
    this.type = type;
    this.slot1SubType = telegramType;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.currentRating = currentRating;
    this.mcc = mcc;

    if (telegramType == "standard telegram 2") {
      this.totalInBytes = 8;
      this.totalOutBytes = 8;
    } else if (telegramType == "siemens telegram 352") {
      console.log("matched 352");
      this.totalInBytes = 12;
      this.totalOutBytes = 12;
    } else if (telegramType == "free telegram") {
      this.totalInBytes = 64;
      this.totalOutBytes = 64;
    }
  }
}

export class SIEMENSSIMOCODE extends Drive {
  name: string;
  description: string;
  type: string;
  partNumber: string = "";
  moduleType: string =
    "GSDML-V2.43-SIEMENS-SIMOCODEproVPN-20220817.xml<DAP 1_V3>";
  slot1: string;
  slot1XmlVersion: number = 31;
  totalInBytes: number = 10;
  totalOutBytes: number = 4;
  nodeAddress: number;
  ioSubSystem: number;
  startAddress: number;
  ipAddress: number[];
  currentRating: number;
  mcc: string;

  constructor(
    name: string,
    description: string,
    nodeAddress: number,
    ioSubSystem: number,
    startAddress: number,
    ipAddress: number[],
    type: string,
    telegramType: string,
    currentRating: number,
    mcc: string
  ) {
    super(
      name,
      description,
      nodeAddress,
      ioSubSystem,
      startAddress,
      ipAddress,
      type,
      telegramType,
      currentRating,
      mcc
    );
    this.name = name;
    this.description = description;
    this.type = type;
    this.slot1 = telegramType;
    this.nodeAddress = nodeAddress;
    this.ioSubSystem = ioSubSystem;
    this.startAddress = startAddress;
    this.ipAddress = ipAddress;
    this.currentRating = currentRating;
    this.mcc = mcc;

    if (telegramType == "basic type 1 v3") {
      this.slot1XmlVersion = 31;
      this.totalInBytes = 10;
      this.totalOutBytes = 4;
    } else if (telegramType == "basic type 2 v3") {
      console.log("matched t2 v3");
      this.slot1XmlVersion = 32;
      this.totalInBytes = 4;
      this.totalOutBytes = 2;
    } else if (telegramType == "basic type 3 v3") {
      this.slot1XmlVersion = 33;
      this.totalInBytes = 20;
      this.totalOutBytes = 6;
    }
  }
}
