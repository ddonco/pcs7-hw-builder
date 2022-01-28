import xlsx from "node-xlsx";
const fs = require("fs");
import {
  DI_6DL11316GF000PK0,
  DO_6DL11326BH000PH1,
  AI_6DL11346TH000PH1,
  AO_6DL11356TF000PH1,
} from "./hw_module";
import { hwBuilderLogger } from "./logger";

const childLogger = hwBuilderLogger.child({ component: "io-parser" });

const DI_MODULE = "DI";
const DO_MODULE = "DO";
const AI_MODULE = "AIHART";
const AO_MODULE = "AOHART";
const DIGITAL_START_ADDRESS = 0;
// const DO_START_ADDRESS = 0;
const ANALOG_START_ADDRESS = 512;
// const AO_START_ADDRESS = 0;

export function parseAssignedIO(ioFilePath: string): [
  {
    [rack: string]: { [slot: string]: any };
  },
  { [type: string]: number }
] {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));
  // const worksheet = xlsx.parse(ioFilePath)

  const data: any = worksheet[0]["data"];

  let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
  let hwModule: any;

  let addressLookup: { [type: string]: number } = {
    nextDigitalAddress: DIGITAL_START_ADDRESS,
    // nextDoAddress: DO_START_ADDRESS,
    nextAnalogAddress: ANALOG_START_ADDRESS,
    // nextAoAddress: AO_START_ADDRESS,
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
      console.log("channel type:", channelType, "built module:", hwModule);
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

export function parseRawIO(ioFilePath: string): {
  [rack: string]: { [slot: string]: any };
} {
  const worksheet = xlsx.parse(fs.readFileSync(ioFilePath));

  const data: any = worksheet[0]["data"];

  let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
  let hwModule: any;

  let addressLookup: { [type: string]: number } = {
    nextDigitalAddress: DIGITAL_START_ADDRESS,
    nextAnalogAddress: ANALOG_START_ADDRESS,
  };

  for (let row = 1; row < data.length; row++) {
    let tagName: string = data[row][0];
    let description: string = data[row][4];
    let channelType: string = data[row][5];
    let assignSuccess: boolean = false;

    if (description === "undefined" || typeof description === "undefined")
      description = "";

    let channelIsSpare = false;
    if (tagName.toUpperCase().includes("SPARE")) channelIsSpare = true;
  }

  return {};
}
