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
  hardwareInfo: { [type: string]: number },
  ioStartAddress: { [moduleType: string]: number } = {},
  groupIoTypes: boolean = false
): any {
  const sortedHW = sortHW(hardwareRacks);

  let addressedHW: { [rack: string]: { [slot: string]: any } };
  if (groupIoTypes) {
    addressedHW = getGroupedIoAddresses(sortedHW, hardwareInfo, ioStartAddress);
  } else {
    addressedHW = getShiftedIoAddresses(sortedHW, ioStartAddress);
  }

  let writeStream = fs.createWriteStream("e:/dev/electron/Sample_Hardware.cfg");
  let buildString: string;

  for (const rack in addressedHW) {
    let rackName = `RIO-${rack}`;
    let deviceNumber = parseInt(rack, 10);
    buildString = buildET200SPHA(rackName, deviceNumber);
    writeStream.write(buildString);

    // for (const slot in addressedHW[rack]) {
    for (const [index, [slot, value]] of Object.entries(
      Object.entries(addressedHW[rack])
    )) {
      if (index === "0" && slot !== "2") {
        childLogger.error(
          "suspected error in slot assignments - Profinet racks typically start with first IO module in slot 2",
          {
            rack: rack,
            slot: slot,
            first_channel: addressedHW[rack][slot].channels[0].tagName,
          }
        );
      }

      if (addressedHW[rack][slot].type === "DI") {
        buildString = buildDIConfig(
          addressedHW[rack][slot].rack,
          addressedHW[rack][slot].slot,
          addressedHW[rack][slot].partNumber,
          addressedHW[rack][slot].description,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].totalInBytes,
          addressedHW[rack][slot].channels
        );
      } else if (addressedHW[rack][slot].type === "DO") {
        buildString = buildDOConfig(
          addressedHW[rack][slot].rack,
          addressedHW[rack][slot].slot,
          addressedHW[rack][slot].partNumber,
          addressedHW[rack][slot].description,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].totalInBytes,
          addressedHW[rack][slot].totalOutBytes,
          addressedHW[rack][slot].channels
        );
      } else if (addressedHW[rack][slot].type === "AI") {
        buildString = buildAIConfig(
          addressedHW[rack][slot].rack,
          addressedHW[rack][slot].slot,
          addressedHW[rack][slot].partNumber,
          addressedHW[rack][slot].revision,
          addressedHW[rack][slot].description,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].totalInBytes,
          addressedHW[rack][slot].hartModulePartNumber,
          addressedHW[rack][slot].channels
        );
      } else if (addressedHW[rack][slot].type === "AO") {
        buildString = buildAOConfig(
          addressedHW[rack][slot].rack,
          addressedHW[rack][slot].slot,
          addressedHW[rack][slot].partNumber,
          addressedHW[rack][slot].revision,
          addressedHW[rack][slot].description,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].startAddress,
          addressedHW[rack][slot].totalInBytes,
          addressedHW[rack][slot].totalOutBytes,
          addressedHW[rack][slot].hartModulePartNumber,
          addressedHW[rack][slot].channels
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

// function getStartingAddresses(
//   hwInfo: { [moduleTyle: string]: number },
//   userParams: { [moduleTyle: string]: number },
//   groupIoTypes: boolean = false
// ): { [moduleTyle: string]: number } {
//   let startingAddresses = {
//     diStart: userParams["diStart"],
//     doStart:
//       userParams["doStart"] +
//       (groupIoTypes ? userParams["digitalOffset"] + hwInfo["diTotalBytes"] : 0),
//     aiStart: userParams["aiStart"],
//     aoStart:
//       userParams["aoStart"] +
//       userParams["analogOffset"] +
//       hwInfo["aiTotalBytes"],
//   };
//   return startingAddresses;
// }

function getShiftedIoAddresses(
  hardwareRacks: { [rack: string]: { [slot: string]: any } },
  startAddress: { [ioType: string]: number }
): { [rack: string]: { [slot: string]: any } } {
  for (const rack in hardwareRacks) {
    for (const slot in hardwareRacks[rack]) {
      if (
        hardwareRacks[rack][slot].type == "AI" ||
        hardwareRacks[rack][slot].type == "AO"
      ) {
        hardwareRacks[rack][slot].startAddress += startAddress["aiStart"] - 512;
      }
      if (
        hardwareRacks[rack][slot].type == "DI" ||
        hardwareRacks[rack][slot].type == "DO"
      ) {
        hardwareRacks[rack][slot].startAddress += startAddress["diStart"];
      }
    }
  }
  return hardwareRacks;
}

function getGroupedIoAddresses(
  hardwareRacks: { [rack: string]: { [slot: string]: any } },
  hardwareInfo: { [ioType: string]: number },
  startAddress: { [ioType: string]: number }
): {
  [rack: string]: { [slot: string]: any };
} {
  let nextAddress = {
    AI: startAddress["aiStart"],
    AO: startAddress["aoStart"],
    DI: startAddress["diStart"],
    DO: startAddress["doStart"],
  };

  if (
    startAddress["aoStart"] <
    startAddress["aiStart"] + hardwareInfo["aiTotalBytes"]
  ) {
    childLogger.error(
      "beginning of ao module addressing must come after all address space reserved by ai modules",
      {
        aiStart: startAddress["aiStart"],
        aiTotalBytes: hardwareInfo["aiTotalBytes"],
        aoStart: startAddress["aoStart"],
      }
    );
  }
  if (
    startAddress["doStart"] <
    startAddress["diStart"] + hardwareInfo["diTotalBytes"]
  ) {
    childLogger.error(
      "beginning of do module addressing must come after all address space reserved by di modules",
      {
        aiStart: startAddress["diStart"],
        aiTotalBytes: hardwareInfo["diTotalBytes"],
        aoStart: startAddress["doStart"],
      }
    );
  }

  for (const rack in hardwareRacks) {
    for (const slot in hardwareRacks[rack]) {
      if (hardwareRacks[rack][slot].type == "AI") {
        hardwareRacks[rack][slot].startAddress = nextAddress["AI"];
        nextAddress["AI"] = hardwareRacks[rack][slot].nextStartAddress();
      }
      if (hardwareRacks[rack][slot].type == "AO") {
        hardwareRacks[rack][slot].startAddress = nextAddress["AO"];
        nextAddress["AO"] = hardwareRacks[rack][slot].nextStartAddress();
      }
      if (hardwareRacks[rack][slot].type == "DI") {
        hardwareRacks[rack][slot].startAddress = nextAddress["DI"];
        nextAddress["DI"] = hardwareRacks[rack][slot].nextStartAddress();
      }
      if (hardwareRacks[rack][slot].type == "DO") {
        hardwareRacks[rack][slot].startAddress = nextAddress["DO"];
        nextAddress["DO"] = hardwareRacks[rack][slot].nextStartAddress();
      }
    }
  }
  return hardwareRacks;
}
