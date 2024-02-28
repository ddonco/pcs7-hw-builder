import xlsx from "node-xlsx";
import { DataFrame } from "data-forge";
import * as fs from "fs";
import {
  DI_6DL11316BH000PH1,
  DO_6DL11326BH000PH1,
  AI_6DL11346TH000PH1,
  AO_6DL11356TF000PH1,
} from "./hw_module";
import type { HWModule } from "./hw_module";
import {
  ABBUMC100,
  ABBVFD,
  SIEMENSSIMOCODE,
  SIEMENSS120,
} from "./drive_module";
import { hwBuilderLogger } from "./logger";

const childLogger = hwBuilderLogger.child({ component: "io-parser" });

const DI_MODULE = "DI";
const DO_MODULE = "DO";
const AI_MODULE = "AI";
const AO_MODULE = "AO";
// const VFD_MODULE = "VFD";
// const FVNR_MODULE = "FVNR";
// const FVR_MODULE = "FVR";
const DriveMap: Record<
  string,
  new (
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
  ) => any
> = {
  ABB_UMC100: ABBUMC100,
  ABB_VFD: ABBVFD,
  SIEMENS_SIMOCODE: SIEMENSSIMOCODE,
  SIEMENS_S120: SIEMENSS120,
};
const DIGITAL_START_ADDRESS = 0;
const ANALOG_START_ADDRESS = 512;

export function parseHeaders(ioFilePath: string): string[] {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));
  const data: any = worksheet[0]["data"];

  const headers = Array.from(data[0], (v: any) => (v === undefined ? "" : v));
  return headers;
}

export function parseAssignedIO(
  ioFilePath: string,
  ioColumnNames: { [columnName: string]: string },
  ioTypeIdentifier: { [ioType: string]: string[] },
  channelZeroStart = false
): [
  {
    [rack: string]: { [slot: string]: any };
  },
  { [type: string]: number }
] {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));
  const data: any = worksheet[0]["data"];

  const headers = Array.from(data[0], (v: any) => (v === undefined ? "" : v));
  let df = new DataFrame({
    columnNames: headers,
    rows: data.slice(1, data.length),
  });

  let dfOrdered = df.orderBy((row: any) => row[ioColumnNames.channel]);
  dfOrdered = dfOrdered.orderBy((row: any) => row[ioColumnNames.slot]);
  const dfArray = dfOrdered
    .orderBy((row: any) => row[ioColumnNames.rack])
    .toArray();

  let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
  let hwModule: any;
  let addressLookup: { [type: string]: number } = {
    nextDigitalAddress: DIGITAL_START_ADDRESS,
    nextAnalogAddress: ANALOG_START_ADDRESS,
    diCount: 0,
    doCount: 0,
    aiCount: 0,
    aoCount: 0,
    diTotalBytes: 0,
    doTotalBytes: 0,
    aiTotalBytes: 0,
    aoTotalBytes: 0,
  };

  for (let row = 0; row < dfArray.length; row++) {
    const rack: number = parseInt(dfArray[row][ioColumnNames.rack], 10);
    const slot: number = parseInt(dfArray[row][ioColumnNames.slot], 10);
    let channel: number = parseInt(dfArray[row][ioColumnNames.channel], 10);
    const tagName: string = dfArray[row][ioColumnNames.tagName];
    let description: string = dfArray[row][ioColumnNames.description];
    let channelType: string = dfArray[row][ioColumnNames.ioType];
    let assignSuccess: boolean = false;

    if (channelZeroStart) channel++;

    if (description === "undefined" || typeof description === "undefined")
      description = "";

    if (
      typeof tagName === "undefined" ||
      typeof description === "undefined" ||
      typeof channelType === "undefined" ||
      typeof rack === "undefined" ||
      isNaN(rack) ||
      typeof slot === "undefined" ||
      isNaN(slot) ||
      typeof channel === "undefined" ||
      isNaN(channel)
    ) {
      childLogger.error(
        `a required column has been found with undefined value, this tag has been skipped`,
        {
          tagName: String(tagName),
          description: String(description),
          channelType: String(channelType),
          rack: String(rack),
          slot: String(slot),
          channel: String(channel),
        }
      );
      continue;
    }

    if (ioTypeIdentifier.di.indexOf(channelType) > -1) {
      channelType = "DI";
    } else if (ioTypeIdentifier.do.indexOf(channelType) > -1) {
      channelType = "DO";
    } else if (ioTypeIdentifier.ai.indexOf(channelType) > -1) {
      channelType = "AI";
    } else if (ioTypeIdentifier.ao.indexOf(channelType) > -1) {
      channelType = "AO";
    } else {
      childLogger.error(
        `IO type not recognized, point will be skipped, row ${row}`,
        {
          tagName: tagName,
          channelType: channelType,
          rack: rack,
          slot: slot,
          channel: channel,
        }
      );
      continue;
    }

    try {
      // Check if rack exists in modules object
      if (rack in hardwareRacks) {
        // Check if slot exists in rack
        if (slot in hardwareRacks[rack]) {
          // Rack and slot exist, so assign channel within module
          assignSuccess = hardwareRacks[rack][slot].assignChannel(
            rack,
            slot,
            channel,
            tagName,
            description
          );
        } else {
          // No module (slot) exists for this channel so build module,
          // add module to rack, and assign channel to module
          [hwModule, addressLookup] = buildModule(
            rack,
            slot,
            addressLookup,
            channelType
          );
          hardwareRacks[rack][slot] = hwModule;
          assignSuccess = hardwareRacks[rack][slot].assignChannel(
            rack,
            slot,
            channel,
            tagName,
            description
          );
        }
      } else {
        // No rack exists for this channel so build module, add rack for this module,
        // assign module to slot within rack, and assign channel to module
        [hwModule, addressLookup] = buildModule(
          rack,
          slot,
          addressLookup,
          channelType
        );
        hardwareRacks[rack] = {};
        hardwareRacks[rack][slot] = hwModule;
        assignSuccess = hardwareRacks[rack][slot].assignChannel(
          rack,
          slot,
          channel,
          tagName,
          description
        );
      }
    } catch (error) {
      childLogger.error(`build module failed, row ${row}`, {
        hw: hardwareRacks[rack][slot],
        tagName: tagName,
        channel: channel,
      });
    }

    if (!assignSuccess)
      childLogger.error("channel assignment failed for the specified tag", {
        rack: rack,
        slot: slot,
        channel: channel,
        tagName: tagName,
      });
  }

  return [hardwareRacks, addressLookup];
}

export function parseDrives(
  driveFilePath: string,
  columnNames: { [columnName: string]: string },
  typeIdentifier: { [moduleType: string]: string[] },
  userAddressParams: { [component: string]: string } = {}
): [
  {
    [node: string]: {};
  },
  { [type: string]: number }
] {
  const worksheet = xlsx.parse(fs.readFileSync(driveFilePath));
  const data: any = worksheet[0]["data"];

  const headers = Array.from(data[0], (v: any) => (v === undefined ? "" : v));
  const df = new DataFrame({
    columnNames: headers,
    rows: data.slice(1, data.length),
  });

  let drives: { [node: string]: {} } = {};
  let driveModule: {};
  let nodeAddress: number = 0;
  let currentNode: number;
  let ipAddressArr: number[];
  let addressLookup: { [component: string]: number } = {
    nextDriveAddress: parseInt(userAddressParams.drive, 10),
    nextNodeAddress: parseInt(userAddressParams.node, 10),
    ioSubSystem: parseInt(userAddressParams.iosubsys, 10),
    driveCount: 0,
    driveTotalBytes: 0,
  };

  const dfArray = df.toArray();
  for (let row = 0; row < dfArray.length; row++) {
    const tagName: string = dfArray[row][columnNames.tagName];
    let description: string = dfArray[row][columnNames.description];
    const ipAddress: string = dfArray[row][columnNames.ipAddress];
    let driveType: string = dfArray[row][columnNames.driveType];
    let telegramType: string = dfArray[row][columnNames.telegramType];
    let ampRating: number = parseFloat(dfArray[row][columnNames.ampRating]);
    let mcc: string = dfArray[row][columnNames.mcc];
    ipAddressArr = [];

    if (columnNames.nodeAddress !== "") {
      nodeAddress = parseInt(dfArray[row][columnNames.nodeAddress], 10);
    }

    if (description === "undefined" || typeof description === "undefined") {
      description = "";
    }
    if (
      ampRating == 0 ||
      typeof ampRating === "undefined" ||
      isNaN(ampRating)
    ) {
      ampRating = 0.5;
    }

    if (
      typeof tagName === "undefined" ||
      typeof description === "undefined" ||
      typeof ipAddress === "undefined" ||
      typeof driveType === "undefined" ||
      typeof ampRating === "undefined"
    ) {
      childLogger.error(
        `a required column has been found with undefined value, this tag has been skipped`,
        {
          tagName: String(tagName),
          description: String(description),
          ipAddress: String(ipAddress),
          nodeAddress: String(ipAddress),
          driveType: String(driveType),
          ampRating: String(ampRating),
        }
      );
      continue;
    }

    if (typeof telegramType === "undefined") {
      telegramType = "";
    }
    if (typeof mcc === "undefined") {
      mcc = "";
    }

    ipAddress.split(".").forEach((item, _) => {
      ipAddressArr.push(parseInt(item, 10));
    });

    if (typeIdentifier.abb_vfd.indexOf(driveType) > -1) {
      driveType = "ABB_UMC100";
    } else if (typeIdentifier.abb_umc.indexOf(driveType) > -1) {
      driveType = "ABB_VFD";
    } else if (typeIdentifier.siemens_vfd.indexOf(driveType) > -1) {
      driveType = "SIEMENS_S120";
    } else if (typeIdentifier.siemens_simocode.indexOf(driveType) > -1) {
      driveType = "SIEMENS_SIMOCODE";
    } else {
      childLogger.error(
        `drive type not recognized - drive will be skipped, row ${row}`,
        {
          tagName: tagName,
          driveType: driveType,
          ampRating: ampRating,
        }
      );
      continue;
    }

    try {
      if (nodeAddress > 0) {
        currentNode = nodeAddress;
      } else {
        currentNode = addressLookup.nextNodeAddress;
      }
      [driveModule, addressLookup] = buildDrive(
        tagName,
        description,
        driveType,
        telegramType,
        ampRating,
        ipAddressArr,
        currentNode,
        mcc,
        addressLookup
      );
      if (Object.keys(driveModule).length === 0) {
        childLogger.error(
          `drive type not recognized - drive will be skipped, row ${row}`,
          {
            tagName: tagName,
            driveType: driveType,
            ampRating: ampRating,
          }
        );
      } else {
        drives[currentNode] = driveModule;
      }
    } catch (error) {
      childLogger.error(`build drive failed, row ${row}`, {
        tagName: tagName,
        driveType: driveType,
        ampRating: ampRating,
      });
    }
  }
  return [drives, addressLookup];
}

function buildModule(
  rack: number,
  slot: number,
  addressLookup: { [type: string]: number },
  moduleType: string
): [any, { [type: string]: number }] {
  if (moduleType === DI_MODULE) {
    const hwModule = new DI_6DL11316BH000PH1(
      addressLookup["nextDigitalAddress"],
      rack,
      slot
    );
    addressLookup["nextDigitalAddress"] = hwModule.nextStartAddress();
    addressLookup["diCount"]++;
    addressLookup["diTotalBytes"] += hwModule.totalInBytes;
    return [hwModule, addressLookup];
  }

  if (moduleType === DO_MODULE) {
    const hwModule = new DO_6DL11326BH000PH1(
      addressLookup["nextDigitalAddress"],
      rack,
      slot
    );
    addressLookup["nextDigitalAddress"] = hwModule.nextStartAddress();
    addressLookup["doCount"]++;
    addressLookup["doTotalBytes"] += hwModule.totalOutBytes;
    return [hwModule, addressLookup];
  }

  if (moduleType === AI_MODULE) {
    const hwModule = new AI_6DL11346TH000PH1(
      addressLookup["nextAnalogAddress"],
      rack,
      slot
    );
    addressLookup["nextAnalogAddress"] = hwModule.nextStartAddress();
    addressLookup["aiCount"]++;
    addressLookup["aiTotalBytes"] += hwModule.totalInBytes;
    return [hwModule, addressLookup];
  }

  if (moduleType === AO_MODULE) {
    const hwModule = new AO_6DL11356TF000PH1(
      addressLookup["nextAnalogAddress"],
      rack,
      slot
    );
    addressLookup["nextAnalogAddress"] = hwModule.nextStartAddress();
    addressLookup["aoCount"]++;
    addressLookup["aoTotalBytes"] += hwModule.totalOutBytes;
    return [hwModule, addressLookup];
  }

  childLogger.error(
    "no module built - module type did not match possible module type options",
    {
      rack: rack,
      slot: slot,
      addressLookup: addressLookup,
      moduleType: moduleType,
    }
  );
  return [{}, addressLookup];
}

function buildDrive(
  tagName: string,
  description: string,
  driveType: string,
  telegramType: string,
  ampRating: number,
  ipAddress: number[],
  nodeAddress: number,
  mcc: string,
  addressLookup: { [type: string]: number }
): [any, { [type: string]: number }] {
  let nextNodeAddress: number = 0;
  if (nodeAddress > 0) {
    nextNodeAddress = nodeAddress;
  } else {
    nextNodeAddress = addressLookup.nextNodeAddress;
  }

  telegramType = telegramType.toLowerCase();

  console.log(`${tagName} - ${telegramType}`);
  if (driveType in DriveMap) {
    const driveModule = new DriveMap[driveType](
      tagName,
      description,
      nextNodeAddress,
      addressLookup.ioSubSystem,
      addressLookup.nextDriveAddress,
      ipAddress,
      driveType,
      telegramType,
      ampRating,
      mcc
    );
    addressLookup.nextNodeAddress = driveModule.nextNodeAddress();
    addressLookup.nextDriveAddress = driveModule.nextStartAddress();
    return [driveModule, addressLookup];
  }

  return [{}, addressLookup];
}

export function parseRawIO(
  ioFilePath: string,
  groupIoModuleTypes: boolean = false
): {
  [rack: string]: { [slot: string]: any };
} {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));
  const data: any = worksheet[0]["data"];

  let df = new DataFrame({
    columnNames: data[0],
    rows: data.slice(1, data.length),
  });

  const dfOrdered = df.orderBy((row: any) => row.Tagnames);
  const dfArray = dfOrdered.orderBy((row: any) => row.Type).toArray();

  const addressLookup: { [type: string]: number } = {
    nextDigitalAddress: DIGITAL_START_ADDRESS,
    nextAnalogAddress: ANALOG_START_ADDRESS,
  };
  const hwModules: { [moduleType: string]: HWModule[] } = {
    diModules: [],
    doModules: [],
    aiModules: [],
    aoModules: [],
  };
  let openDiModule: DI_6DL11316BH000PH1 = new DI_6DL11316BH000PH1();
  let openDoModule: DO_6DL11326BH000PH1 = new DO_6DL11326BH000PH1();
  let openAiModule: AI_6DL11346TH000PH1 = new AI_6DL11346TH000PH1();
  let openAoModule: AO_6DL11356TF000PH1 = new AO_6DL11356TF000PH1();

  for (let r = 0; r < dfArray.length; r++) {
    const tagName: string = dfArray[r]["Tagnames"];
    let description: string = dfArray[r]["Comment"];
    const channelType: string = dfArray[r]["Type"];

    if (description === "undefined" || typeof description === "undefined")
      description = "";

    if (channelType === DI_MODULE) {
      if (
        hwModules["diModules"].length <= 0 ||
        openDiModule.nextOpenChannel < 0
      ) {
        openDiModule = new DI_6DL11316BH000PH1();
        hwModules["diModules"].push(openDiModule);
      }
      openDiModule.assignChannel(
        0,
        0,
        openDiModule.nextOpenChannel,
        tagName,
        description
      );
    }
    if (channelType === DO_MODULE) {
      if (
        hwModules["doModules"].length <= 0 ||
        openDoModule.nextOpenChannel < 0
      ) {
        openDoModule = new DO_6DL11326BH000PH1();
        hwModules["doModules"].push(openDoModule);
      }
      openDoModule.assignChannel(
        0,
        0,
        openDoModule.nextOpenChannel,
        tagName,
        description
      );
    }
    if (channelType === AI_MODULE) {
      if (
        hwModules["aiModules"].length <= 0 ||
        openAiModule.nextOpenChannel < 0
      ) {
        openAiModule = new AI_6DL11346TH000PH1();
        hwModules["aiModules"].push(openAiModule);
      }
      openAiModule.assignChannel(
        0,
        0,
        openAiModule.nextOpenChannel,
        tagName,
        description
      );
    }
    if (channelType === AO_MODULE) {
      if (
        hwModules["aoModules"].length <= 0 ||
        openAoModule.nextOpenChannel < 0
      ) {
        openAoModule = new AO_6DL11356TF000PH1();
        hwModules["aoModules"].push(openAoModule);
      }
      openAoModule.assignChannel(
        0,
        0,
        openAoModule.nextOpenChannel,
        tagName,
        description
      );
    }
  }

  let currentRack = 1;
  let currentSlot = 2;
  let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
  let previousModuleType = "";
  for (const [_, moduleList] of Object.entries(hwModules)) {
    for (let i = 0; i < moduleList.length; i++) {
      if (!(currentRack in hardwareRacks)) {
        hardwareRacks[currentRack] = {};
      }
      if (moduleList[i].type === "DI" || moduleList[i].type === "DO") {
        moduleList[i].startAddress = addressLookup["nextDigitalAddress"];
        addressLookup["nextDigitalAddress"] = moduleList[i].nextStartAddress();
      }
      if (moduleList[i].type === "AI" || moduleList[i].type === "AO") {
        moduleList[i].startAddress = addressLookup["nextAnalogAddress"];
        addressLookup["nextAnalogAddress"] = moduleList[i].nextStartAddress();
      }
      moduleList[i].rack = currentRack;
      moduleList[i].slot = currentSlot;
      moduleList[i].updateChannelAddresses();
      hardwareRacks[currentRack][currentSlot] = moduleList[i];
      currentSlot++;

      if (groupIoModuleTypes && moduleList[i].type !== previousModuleType) {
        if (previousModuleType !== "") currentRack++;
      }

      if (currentSlot > 40) currentRack++;

      previousModuleType = moduleList[i].type;
    }
  }
  console.log("FINAL:", hardwareRacks);

  return hardwareRacks;
}
