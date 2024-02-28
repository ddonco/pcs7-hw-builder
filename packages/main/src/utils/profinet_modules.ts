import { channel } from "diagnostics_channel";
import { Channel } from "./hw_module";
import {
  buildAIDiagnostics,
  buildAODiagnostics,
  buildDI8Diagnostics,
  buildDI16Diagnostics,
  buildDODiagnostics,
} from "./profinet_diagnostics";

function buildDiagnosticSymbols(
  channelType: string,
  channels: Channel[]
): string {
  let returnString = "";
  let symbolType = "I";
  let symbolOffset = 1;
  if (channelType === "AI" || channelType === "AO") symbolOffset = 2;
  if (channelType === "AO" || channelType === "DO") symbolType = "O";

  channels.forEach((channel, index) => {
    returnString += `SYMBOL  ${symbolType} , ${symbolOffset * index}, "${
      channel.tagName
    }", "${channel.description}"\n`;
  });
  return returnString;
}

export function buildModuleSymbolTable(
  channelType: string,
  channels: Channel[]
) {
  let returnString = "";
  const rowStart = "126,";
  const symbolType: { [type: string]: string } = {
    AI: "IW",
    AO: "QW",
    DI: "I",
    DO: "Q",
  };
  const dataType: { [type: string]: string } = {
    AI: "WORD",
    AO: "WORD",
    DI: "BOOL",
    DO: "BOOL",
  };

  channels.forEach((channel, _) => {
    returnString +=
      rowStart +
      channel.tagName.padEnd(24, " ") +
      symbolType[channelType].padEnd(5, " ") +
      (dataType[channelType].includes("W")
        ? channel.address.slice(0, channel.address.indexOf("."))
        : channel.address
      ).padEnd(7, " ") +
      dataType[channelType].padEnd(10, " ") +
      channel.description +
      "\n";
  });
  return returnString;
}

function buildHartConfig(
  rackNumber: number,
  slotNumber: number,
  hartModuleType: string,
  channels: Channel[]
): string {
  let returnString = "";
  channels.forEach((channel, index) => {
    returnString += `IOSUBSYSTEM 100, IOADDRESS ${rackNumber}, SLOT ${slotNumber}, SUBSLOT ${
      index + 1
    }, "${hartModuleType}", "${channel.tagName}"
    BEGIN
    END\n`;
  });
  return returnString;
}

export function buildAIConfig(
  rackNumber: number,
  slotNumber: number,
  modulePartNo: string,
  moduleVersion: string,
  moduleName: string,
  moduleAddress: number,
  moduleBytesSize: number,
  hartModuleType: string,
  channels: Channel[],
  enableAllChannels: boolean,
  enableHartChannels: boolean,
  pip: number
): string {
  const begin = `IOSUBSYSTEM 100, IOADDRESS ${("00" + rackNumber).slice(
    -2
  )}, SLOT ${("00" + slotNumber).slice(
    -2
  )}, "${modulePartNo}" "V${moduleVersion}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleAddress}, 0, ${moduleBytesSize}, ${pip}, 0, 32\n`;
  const symbols = buildDiagnosticSymbols("AI", channels);
  const diagnostics = buildAIDiagnostics(
    channels,
    enableAllChannels,
    enableHartChannels
  );
  const end = `  POTENTIAL_GROUP, "NEW_GROUP"
  END\n`;
  const hartModules = buildHartConfig(
    rackNumber,
    slotNumber,
    hartModuleType,
    channels
  );
  return begin + symbols + diagnostics + end + hartModules;
}

export function buildAOConfig(
  rackNumber: number,
  slotNumber: number,
  modulePartNo: string,
  moduleVersion: string,
  moduleName: string,
  moduleInAddress: number,
  moduleOutAddress: number,
  moduleInBytesSize: number,
  moduleOutBytesSize: number,
  hartModuleType: string,
  channels: Channel[],
  enableAllChannels: boolean,
  enableHartChannels: boolean,
  pip: number
): string {
  const begin = `IOSUBSYSTEM 100, IOADDRESS ${("00" + rackNumber).slice(
    -2
  )}, SLOT ${("00" + slotNumber).slice(
    -2
  )}, "${modulePartNo}" "V${moduleVersion}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleInAddress}, 0, ${moduleInBytesSize}, ${pip}, 0, 32
  LOCAL_OUT_ADDRESSES
    ADDRESS  ${moduleOutAddress}, 0, ${moduleOutBytesSize}, ${pip}, 0, 32\n`;
  const symbols = buildDiagnosticSymbols("AO", channels);
  const diagnostics = buildAODiagnostics(
    channels,
    enableAllChannels,
    enableHartChannels
  );
  const end = `  POTENTIAL_GROUP, "NEW_GROUP"
  END\n`;
  const hartModules = buildHartConfig(
    rackNumber,
    slotNumber,
    hartModuleType,
    channels
  );
  return begin + symbols + diagnostics + end + hartModules;
}

export function buildDIConfig(
  rackNumber: number,
  slotNumber: number,
  modulePartNo: string,
  moduleName: string,
  moduleAddress: number,
  moduleBytesSize: number,
  channels: Channel[],
  enableAllChannels: boolean,
  pip: number
): string {
  const begin = `IOSUBSYSTEM 100, IOADDRESS ${("00" + rackNumber).slice(
    -2
  )}, SLOT ${("00" + slotNumber).slice(-2)}, "${modulePartNo}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleAddress}, 0, ${moduleBytesSize}, ${pip}, 0, 16\n`;
  const symbols = buildDiagnosticSymbols("DI", channels);

  let diagnostics: string;
  if (channels.length == 8) {
    diagnostics = buildDI8Diagnostics(channels, enableAllChannels);
  } else {
    diagnostics = buildDI16Diagnostics(channels, enableAllChannels);
  }

  const end = `  POTENTIAL_GROUP, "NEW_GROUP"
  END\n`;
  return begin + symbols + diagnostics + end;
}

export function buildDOConfig(
  rackNumber: number,
  slotNumber: number,
  modulePartNo: string,
  moduleName: string,
  moduleInAddress: number,
  moduleOutAddress: number,
  moduleInBytesSize: number,
  moduleOutBytesSize: number,
  channels: Channel[],
  enableAllChannels: boolean,
  pip: number
): string {
  const begin = `IOSUBSYSTEM 100, IOADDRESS ${("00" + rackNumber).slice(
    -2
  )}, SLOT ${("00" + slotNumber).slice(-2)}, "${modulePartNo}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleInAddress}, 0, ${moduleInBytesSize}, ${pip}, 0, 16
  LOCAL_OUT_ADDRESSES
    ADDRESS  ${moduleOutAddress}, 0, ${moduleOutBytesSize}, ${pip}, 0, 16\n`;
  const symbols = buildDiagnosticSymbols("DO", channels);
  const diagnostics = buildDODiagnostics(channels, enableAllChannels);
  const end = `  POTENTIAL_GROUP, "NEW_GROUP"
  END\n`;
  return begin + symbols + diagnostics + end;
}
