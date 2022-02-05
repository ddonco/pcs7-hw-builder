import { channel } from "diagnostics_channel";
import { Channel } from "./hw_module";
import {
  buildAIDiagnostics,
  buildAODiagnostics,
  buildDI8Diagnostics,
  buildDI16Diagnostics,
  buildDODiagnostics,
} from "./profinet_diagnostics";

function buildSymbols(channelType: string, channels: Channel[]): string {
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
  channels: Channel[]
): string {
  let begin = `IOSUBSYSTEM 100, IOADDRESS ${rackNumber}, SLOT ${slotNumber}, "${modulePartNo}" "V${moduleVersion}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleAddress}, 0, ${moduleBytesSize}, 0, 0, 32\n`;
  let symbols = buildSymbols("AI", channels);
  let diagnostics = buildAIDiagnostics(channels);
  let end = `  POTENTIAL_GROUP, "NEW_GROUP"
  END\n`;
  let hartModules = buildHartConfig(
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
  channels: Channel[]
): string {
  let begin = `IOSUBSYSTEM 100, IOADDRESS ${rackNumber}, SLOT ${slotNumber}, "${modulePartNo}" "V${moduleVersion}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleInAddress}, 0, ${moduleInBytesSize}, 0, 0, 32
  LOCAL_OUT_ADDRESSES
    ADDRESS  ${moduleOutAddress}, 0, ${moduleOutBytesSize}, 0, 0, 32\n`;
  let symbols = buildSymbols("AO", channels);
  let diagnostics = buildAODiagnostics(channels);
  let end = `  POTENTIAL_GROUP, "NEW_GROUP"
    END\n`;
  let hartModules = buildHartConfig(
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
  channels: Channel[]
): string {
  let begin = `IOSUBSYSTEM 100, IOADDRESS ${rackNumber}, SLOT ${slotNumber}, "${modulePartNo}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleAddress}, 0, ${moduleBytesSize}, 0, 0, 16\n`;
  let symbols = buildSymbols("DI", channels);

  let diagnostics: string;
  if (channels.length == 8) {
    diagnostics = buildDI8Diagnostics(channels);
  } else {
    diagnostics = buildDI16Diagnostics(channels);
  }

  let end = `  POTENTIAL_GROUP, "NEW_GROUP"
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
  channels: Channel[]
): string {
  let begin = `IOSUBSYSTEM 100, IOADDRESS ${rackNumber}, SLOT ${slotNumber}, "${modulePartNo}", "${moduleName}"
  BEGIN 
  LOCAL_IN_ADDRESSES 
    ADDRESS  ${moduleInAddress}, 0, ${moduleInBytesSize}, 0, 0, 16
  LOCAL_OUT_ADDRESSES
    ADDRESS  ${moduleOutAddress}, 0, ${moduleOutBytesSize}, 0, 0, 16\n`;
  let symbols = buildSymbols("DO", channels);
  let diagnostics = buildDODiagnostics(channels);
  let end = `  POTENTIAL_GROUP, "NEW_GROUP"
    END\n`;
  return begin + symbols + diagnostics + end;
}
