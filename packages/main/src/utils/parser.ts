import xlsx from "node-xlsx";
import { DataFrame } from "data-forge";
import * as fs from "fs";
import {
  DI_6DL11316GF000PK0,
  DO_6DL11326BH000PH1,
  AI_6DL11346TH000PH1,
  AO_6DL11356TF000PH1,
  HWModule,
} from "./hw_module";
import { hwBuilderLogger } from "./logger";

const childLogger = hwBuilderLogger.child({ component: "io-parser" });

const DI_MODULE = "DI";
const DO_MODULE = "DO";
const AI_MODULE = "AIHART";
const AO_MODULE = "AOHART";
const DIGITAL_START_ADDRESS = 0;
const ANALOG_START_ADDRESS = 512;

export function parseAssignedIO(
  ioFilePath: string,
  channelZeroStart: boolean = false
): [
  {
    [rack: string]: { [slot: string]: any };
  },
  { [type: string]: number }
] {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));

  const data: any = worksheet[0]["data"];

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

  for (let row = 1; row < data.length; row++) {
    let rack: number = parseInt(data[row][1], 10);
    let slot: number = parseInt(data[row][2], 10);
    let channel: number = parseInt(data[row][3], 10);
    let tagName: string = data[row][5];
    let description: string = data[row][9];
    let channelType: string = data[row][10];
    let assignSuccess: boolean = false;

    if (channelZeroStart) channel++;

    if (description === "undefined" || typeof description === "undefined")
      description = "";

    let channelIsSpare = false;
    if (tagName.toUpperCase().includes("SPARE")) channelIsSpare = true;

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
          description,
          channelIsSpare
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
          description,
          channelIsSpare
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
        description,
        channelIsSpare
      );
    }

    if (!assignSuccess)
      childLogger.error("channel assignment failed for the specified tag", {
        rack: rack,
        slot: slot,
        channel: channel,
        tagName: tagName,
      });
  }

  // console.log(hardwareRacks);
  return [hardwareRacks, addressLookup];
}

function buildModule(
  rack: number,
  slot: number,
  addressLookup: { [type: string]: number },
  moduleType: string
): [any, { [type: string]: number }] {
  if (moduleType === DI_MODULE) {
    let hwModule = new DI_6DL11316GF000PK0(
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
    let hwModule = new DO_6DL11326BH000PH1(
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
    let hwModule = new AI_6DL11346TH000PH1(
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
    let hwModule = new AO_6DL11356TF000PH1(
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

  df = df.orderBy((row: any) => row.Tagnames);
  let dfArray = df.orderBy((row: any) => row.Type).toArray();

  let addressLookup: { [type: string]: number } = {
    nextDigitalAddress: DIGITAL_START_ADDRESS,
    nextAnalogAddress: ANALOG_START_ADDRESS,
  };
  let hwModules: { [moduleType: string]: HWModule[] } = {
    diModules: [],
    doModules: [],
    aiModules: [],
    aoModules: [],
  };
  let openDiModule: DI_6DL11316GF000PK0 = new DI_6DL11316GF000PK0();
  let openDoModule: DO_6DL11326BH000PH1 = new DO_6DL11326BH000PH1();
  let openAiModule: AI_6DL11346TH000PH1 = new AI_6DL11346TH000PH1();
  let openAoModule: AO_6DL11356TF000PH1 = new AO_6DL11356TF000PH1();

  for (let r = 0; r < dfArray.length; r++) {
    let tagName: string = dfArray[r]["Tagnames"];
    let description: string = dfArray[r]["Comment"];
    let channelType: string = dfArray[r]["Type"];
    // console.log(tagName, description, channelType);

    if (description === "undefined" || typeof description === "undefined")
      description = "";

    let channelIsSpare = false;
    if (tagName.toUpperCase().includes("SPARE")) channelIsSpare = true;

    if (channelType === "DI") {
      if (
        hwModules["diModules"].length <= 0 ||
        openDiModule.nextOpenChannel < 0
      ) {
        openDiModule = new DI_6DL11316GF000PK0();
        hwModules["diModules"].push(openDiModule);
      }
      openDiModule.assignChannel(
        0,
        0,
        openDiModule.nextOpenChannel,
        tagName,
        description,
        channelIsSpare
      );
    }
    if (channelType === "DO") {
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
        description,
        channelIsSpare
      );
    }
    if (channelType === "AIHART") {
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
        description,
        channelIsSpare
      );
    }
    if (channelType === "AOHART") {
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
        description,
        channelIsSpare
      );
    }
  }

  let currentRack = 1;
  let currentSlot = 2;
  let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
  let previousModuleType = "";
  for (let [_, moduleList] of Object.entries(hwModules)) {
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
      // console.log("Inspect Channels:", moduleList[i].channels);

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
