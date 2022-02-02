import { hwBuilderLogger } from "./logger";

const childLogger = hwBuilderLogger.child({ component: "module-builder" });

export class Channel {
  channelNumber: number;
  address: string;
  type: string;
  tagName: string;
  description: string;
  spare: boolean;

  constructor(
    channelNumber: number,
    address: string,
    type: string,
    tagName: string,
    description: string,
    spare: boolean
  ) {
    this.channelNumber = channelNumber;
    this.address = address;
    this.type = type;
    this.tagName = tagName;
    this.description = description;
    this.spare = spare;
  }
}

export class HWModule {
  partNumber: string = "";
  description: string = "";
  type: string = "";
  channelCount: number = 8;
  bytesPerChannel: number = 0.1;
  totalInBytes: number = 2;
  totalOutBytes: number = 2;
  revision: string = "V1.0";
  channels: Channel[] = [];
  nextOpenChannel: number = 1; // Channel count starts at 1
  startAddress: number = 0;
  rack: number = 0;
  slot: number = 0;

  assignChannel(
    rack: number,
    slot: number,
    channelNumber: number,
    tagName: string,
    description: string,
    spare: boolean = false
  ): boolean {
    // Check if rack and slot assignments for the channel match this modules rack and slot assignments
    if (rack !== this.rack || slot !== this.slot) {
      // Rack or slot mismatch, channel not assigned
      childLogger.error("rack or slot mismatch, channel not assigned", {
        rack: { module: this.rack, assignment: rack },
        slot: { module: this.slot, assignment: slot },
        channel: channelNumber,
        tag: tagName,
      });

      return false;
    }
    if (!this.channels[channelNumber - 1].spare) {
      // Channel is not spare and has already been assigned, channel not assigned
      childLogger.error(
        "specified channel is not spare (already been assigned), channel not assigned",
        {
          rack: rack,
          slot: slot,
          channel: channelNumber,
          tag: tagName,
        }
      );
      return false;
    }
    this.channels[channelNumber - 1].tagName = tagName;
    this.channels[channelNumber - 1].description = description;
    this.channels[channelNumber - 1].spare = spare;
    this.nextOpenChannel++;
    if (this.nextOpenChannel > this.channelCount) this.nextOpenChannel = -1;
    // Channel was assigned
    return true;
  }

  nextStartAddress(): number {
    let nextInAddress = this.startAddress + this.totalInBytes;
    let nextOutAddress = this.startAddress + this.totalOutBytes;
    return nextInAddress > nextOutAddress ? nextInAddress : nextOutAddress;
  }

  updateChannelAddresses() {
    for (let i = 0; i < this.channels.length; i++) {
      this.channels[i].address = (
        this.startAddress +
        this.bytesPerChannel * i
      ).toFixed(1);
    }
  }
}

export class DI_6DL11316GF000PK0 extends HWModule {
  partNumber: string = "6DL1 131-6GF00-0PK0";
  description: string = "DI8 x 230VAC HA";
  type: string = "DI";
  channelCount: number = 8;
  bytesPerChannel: number = 0.1;
  totalInBytes: number = 2;
  totalOutBytes: number = 0;
  revision: string = "V1.0";
  channels: Channel[] = [];
  nextOpenChannel: number = 1; // Channel count starts at 1
  startAddress: number = 0;
  rack: number = 0;
  slot: number = 0;

  constructor(startAddress: number = 0, rack: number = 0, slot: number = 0) {
    super();
    this.startAddress = startAddress;
    this.rack = rack;
    this.slot = slot;

    for (let i = 1; i <= this.channelCount; i++) {
      this.channels.push(
        new Channel(
          i,
          (this.startAddress + i * this.bytesPerChannel).toFixed(1),
          this.type,
          `SPARE_R${("00" + this.rack).slice(-2)}S${("00" + this.slot).slice(
            -2
          )}C${("00" + i).slice(-2)}`,
          "",
          true
        )
      );
    }
  }
}

export class DO_6DL11326BH000PH1 extends HWModule {
  partNumber: string = "6DL1 132-6BH00-0PH1";
  description: string = "DQ16 x 24VDC/0.5A HA";
  type: string = "DO";
  channelCount: number = 16;
  bytesPerChannel: number = 0.1;
  totalInBytes: number = 2;
  totalOutBytes: number = 2;
  revision: string = "V1.0";
  channels: Channel[] = [];
  nextOpenChannel: number = 1; // Channel count starts at 1
  startAddress: number = 0;
  rack: number = 0;
  slot: number = 0;

  constructor(startAddress: number = 0, rack: number = 0, slot: number = 0) {
    super();
    this.startAddress = startAddress;
    this.rack = rack;
    this.slot = slot;

    for (let i = 1; i <= this.channelCount; i++) {
      this.channels.push(
        new Channel(
          i,
          (this.startAddress + i * this.bytesPerChannel).toFixed(1),
          this.type,
          `SPARE_R${("00" + this.rack).slice(-2)}S${("00" + this.slot).slice(
            -2
          )}C${("00" + i).slice(-2)}`,
          "",
          true
        )
      );
    }
  }
}

export class AI_6DL11346TH000PH1 extends HWModule {
  partNumber: string = "6DL1 134-6TH00-0PH1";
  description: string = "AI16 x I 2-wire HART HA";
  hartModulePartNumber: string =
    "_S7H_HSP_6DL1_133_6EW00_0PH1_SUBMODUL_HART_CT";
  type: string = "AI";
  channelCount: number = 16;
  bytesPerChannel: number = 2;
  totalInBytes: number = 34;
  totalOutBytes: number = 0;
  revision: string = "V1.1";
  channels: Channel[] = [];
  nextOpenChannel: number = 1; // Channel count starts at 1
  startAddress: number = 0;
  rack: number = 0;
  slot: number = 0;

  constructor(startAddress: number = 0, rack: number = 0, slot: number = 0) {
    super();
    this.startAddress = startAddress;
    this.rack = rack;
    this.slot = slot;

    for (let i = 1; i <= this.channelCount; i++) {
      this.channels.push(
        new Channel(
          i,
          (this.startAddress + i * this.bytesPerChannel).toFixed(1),
          this.type,
          `SPARE_R${("00" + this.rack).slice(-2)}S${("00" + this.slot).slice(
            -2
          )}C${("00" + i).slice(-2)}`,
          "",
          true
        )
      );
    }
  }
}

export class AO_6DL11356TF000PH1 extends HWModule {
  partNumber: string = "6DL1 135-6TF00-0PH1";
  description: string = "AQ8 x I HART HA";
  hartModulePartNumber: string =
    "_S7H_HSP_6DL1_135_6TF00_0PH1_SUBMODUL_HART_CT";
  type: string = "AO";
  channelCount: number = 8;
  bytesPerChannel: number = 2;
  totalInBytes: number = 1;
  totalOutBytes: number = 16;
  revision: string = "V1.0";
  channels: Channel[] = [];
  nextOpenChannel: number = 1; // Channel count starts at 1
  startAddress: number = 0;
  rack: number = 0;
  slot: number = 0;

  constructor(startAddress: number = 0, rack: number = 0, slot: number = 0) {
    super();
    this.startAddress = startAddress;
    this.rack = rack;
    this.slot = slot;

    for (let i = 1; i <= this.channelCount; i++) {
      this.channels.push(
        new Channel(
          i,
          (this.startAddress + i * this.bytesPerChannel).toFixed(1),
          this.type,
          `SPARE_R${("00" + this.rack).slice(-2)}S${("00" + this.slot).slice(
            -2
          )}C${("00" + i).slice(-2)}`,
          "",
          true
        )
      );
    }
  }
}
