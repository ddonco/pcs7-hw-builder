const fs = require("fs");
import { buildET200SPHA } from "./profinet_racks";
import {
  buildDIConfig,
  buildDOConfig,
  buildAIConfig,
  buildAOConfig,
} from "./profinet_modules";
import { hwBuilderLogger } from "./logger";

const childLogger = hwBuilderLogger.child({ component: "rack-builder" });

export function buildHW(
  hardwareRacks: {
    [rack: string]: { [slot: string]: any };
  },
  ioStartAddress: { [moduleType: string]: number } = {},
  groupIoTypes: boolean = false
): any {
  const sortedHW = sortHW(hardwareRacks);

  let writeStream = fs.createWriteStream("e:/dev/electron/Sample_Hardware.cfg");
  let buildString: string;

  for (const rack in sortedHW) {
    let rackName = `RIO-${rack}`;
    let deviceNumber = parseInt(rack, 10);
    buildString = buildET200SPHA(rackName, deviceNumber);
    writeStream.write(buildString);

    // for (const slot in sortedHW[rack]) {
    for (const [index, [slot, value]] of Object.entries(
      Object.entries(sortedHW[rack])
    )) {
      if (index === "0" && slot !== "2") {
        childLogger.error(
          "suspected error in slot assignments - Profinet racks typically start with first IO module in slot 2",
          {
            rack: rack,
            slot: slot,
            first_channel: sortedHW[rack][slot].channels[0].tagName,
          }
        );
      }

      if (sortedHW[rack][slot].type === "DI") {
        buildString = buildDIConfig(
          sortedHW[rack][slot].rack,
          sortedHW[rack][slot].slot,
          sortedHW[rack][slot].partNumber,
          sortedHW[rack][slot].description,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].totalInBytes,
          sortedHW[rack][slot].channels
        );
      } else if (sortedHW[rack][slot].type === "DO") {
        buildString = buildDOConfig(
          sortedHW[rack][slot].rack,
          sortedHW[rack][slot].slot,
          sortedHW[rack][slot].partNumber,
          sortedHW[rack][slot].description,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].totalInBytes,
          sortedHW[rack][slot].totalOutBytes,
          sortedHW[rack][slot].channels
        );
      } else if (sortedHW[rack][slot].type === "AI") {
        buildString = buildAIConfig(
          sortedHW[rack][slot].rack,
          sortedHW[rack][slot].slot,
          sortedHW[rack][slot].partNumber,
          sortedHW[rack][slot].revision,
          sortedHW[rack][slot].description,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].totalInBytes,
          sortedHW[rack][slot].hartModulePartNumber,
          sortedHW[rack][slot].channels
        );
      } else if (sortedHW[rack][slot].type === "AO") {
        buildString = buildAOConfig(
          sortedHW[rack][slot].rack,
          sortedHW[rack][slot].slot,
          sortedHW[rack][slot].partNumber,
          sortedHW[rack][slot].revision,
          sortedHW[rack][slot].description,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].startAddress,
          sortedHW[rack][slot].totalInBytes,
          sortedHW[rack][slot].totalOutBytes,
          sortedHW[rack][slot].hartModulePartNumber,
          sortedHW[rack][slot].channels
        );
      }
      writeStream.write(buildString);
    }
  }

  writeStream.on("finish", () => {
    console.log("Export Complete");
  });
  writeStream.end();
  return {};
}

function sortHW(hardwareRacks: { [rack: string]: { [slot: string]: any } }): {
  [rack: string]: { [slot: string]: any };
} {
  // Sorted hardware object that will be returned from function
  let sortedHW: { [rack: string]: { [slot: string]: any } } = {};
  // List of racks used to sort racks into ascending order
  let racks = [];
  // Object containing lists of slots in each rack used to sort
  // slots into ascending order
  let slotsInRacks: { [rack: string]: number[] } = {};

  // Iterate over racks in hardware and append the rack numbers to racks list,
  // also create a key for this rack in slots object and initialize value to empty list
  for (const rack in hardwareRacks) {
    racks.push(parseInt(rack, 10));
    slotsInRacks[rack] = [];
    // Iterate over slots in current rack and append these slot numbers to list representing this rack
    for (const slot in hardwareRacks[rack]) {
      slotsInRacks[rack].push(parseInt(slot, 10));
    }
    // Sort the final list of slots in this rack
    slotsInRacks[rack].sort((a, b) => {
      return a - b;
    });
  }
  // Sort the final list of racks
  racks.sort((a, b) => {
    return a - b;
  });

  // Iterate over sorted racks to build sortedHW in ascending rack order
  racks.forEach((rack, rIndex) => {
    sortedHW[rack] = {};
    slotsInRacks[rack].forEach((slot, sIndex) => {
      sortedHW[rack][slot] = hardwareRacks[rack.toString()][slot.toString()];
    });
  });

  return sortedHW;
}

function getStartingAddresses(
  hwInfo: { [moduleTyle: string]: number },
  userParams: { [moduleTyle: string]: number },
  groupIoTypes: boolean = false
): { [moduleTyle: string]: number } {
  let startingAddresses = {
    diStart: userParams["diStart"],
    doStart:
      userParams["doStart"] +
      (groupIoTypes ? userParams["digitalOffset"] + hwInfo["diTotalBytes"] : 0),
    aiStart: userParams["aiStart"],
    aoStart:
      userParams["aoStart"] +
      userParams["analogOffset"] +
      hwInfo["aiTotalBytes"],
  };
  return startingAddresses;
}

// function groupIoTypes
