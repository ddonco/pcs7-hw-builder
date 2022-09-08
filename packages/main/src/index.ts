import {
  app,
  BrowserWindow,
  dialog,
  ipcMain,
  WebContents,
  webContents,
} from "electron";
import "./security-restrictions";
import { restoreOrCreateWindow } from "/@/mainWindow";
import {
  parseAssignedIO,
  parseHeaders,
  parseRawIO,
  parseDrives,
} from "./utils/parser";
import { buildHWConfig, buildDrivesConfig } from "./utils/builder";
const fsExtra = require("fs-extra");

let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
let drives: { [node: string]: {} } = {};
let sortedRacks: { [rack: string]: { [slot: string]: any } } = {};
let hardwareInfo: { [type: string]: number } = {};
let driveInfo: { [type: string]: number } = {};
let ioFilePath: string = "";
let driveFilePath: string = "";
let parsedHeaders: string[] = [];
let columnNames: { [col: string]: string } = {};
let typeIdentifier: { [ioType: string]: string[] } = {};
let args: { [prop: string]: any } = {};
let groupIOAddresses = true;
let userAddressParams: { [ioType: string]: string } = {};
let startIpAddress: string;
let buildOptions: { [option: string]: any } = {
  enableAllChannels: false,
  analogPIP: 3,
  digitalPIP: 4,
  drivePIP: 4,
};
let buildSymbolTable = true;

const logFile = "logs/hw_builder.log";

/**
 * Prevent multiple instances
 */
const isSingleInstance = app.requestSingleInstanceLock();
if (!isSingleInstance) {
  app.quit();
  process.exit(0);
}
app.on("second-instance", restoreOrCreateWindow);

/**
 * Disable Hardware Acceleration for more power-save
 */
app.disableHardwareAcceleration();

/**
 * Shout down background process if all windows was closed
 */
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

/**
 * @see https://www.electronjs.org/docs/v14-x-y/api/app#event-activate-macos Event: 'activate'
 */
app.on("activate", restoreOrCreateWindow);

/**
 * Create app window when background process will be ready
 */
app
  .whenReady()
  .then(restoreOrCreateWindow)
  .catch((e) => console.error("Failed create window:", e));

/**
 * Install Vue.js or some other devtools in development mode only
 */
if (import.meta.env.DEV) {
  app
    .whenReady()
    .then(() => import("electron-devtools-installer"))
    .then(({ default: installExtension, VUEJS3_DEVTOOLS }) =>
      installExtension(VUEJS3_DEVTOOLS, {
        loadExtensionOptions: {
          allowFileAccess: true,
        },
      })
    )
    .catch((e) => console.error("Failed install extension:", e));
}

/**
 * Check new app version in production mode only
 */
if (import.meta.env.PROD) {
  app
    .whenReady()
    .then(() => import("electron-updater"))
    .then(({ autoUpdater }) => autoUpdater.checkForUpdatesAndNotify())
    .catch((e) => console.error("Failed check updates:", e));
}

ipcMain.on("toMain", (event, args) => {
  console.log(`args: ${JSON.stringify(args)}`);
  if ("updateLogs" in args) {
    try {
      const fileContent = fsExtra.readFileSync(logFile, "utf8");
      const logsArr = fileContent.split(/\r?\n/);
      event.sender.send("fromMain", {
        logs: logsArr.slice(0, -1),
      });
    } catch (e) {
      console.log(`update logs error: ${e}`);
    }
  }

  if ("assignedIoFilePath" in args) {
    try {
      ioFilePath = args["assignedIoFilePath"];
      parsedHeaders = parseHeaders(ioFilePath);
      event.sender.send("fromMain", { parsedHeaders: parsedHeaders });
    } catch (e) {
      console.log(`parse headers error: ${e}`);
    }
  }

  if ("assignedDriveFilePath" in args) {
    try {
      driveFilePath = args["assignedDriveFilePath"];
      parsedHeaders = parseHeaders(driveFilePath);
      event.sender.send("fromMain", { parsedHeaders: parsedHeaders });
    } catch (e) {
      console.log(`parse headers error: ${e}`);
    }
  }

  if ("parseAssignedIo" in args) {
    try {
      const payload = JSON.parse(args["payload"]);
      ioFilePath = payload["filePath"];
      columnNames = payload["columnNames"];
      typeIdentifier = payload["identifiers"];
      [hardwareRacks, hardwareInfo] = parseAssignedIO(
        ioFilePath,
        columnNames,
        typeIdentifier,
        true
      );
      console.log(`hardwareInfo: ${JSON.stringify(hardwareInfo)}`);
      event.sender.send("fromMain", { parseAssignedIo: hardwareInfo });
    } catch (e) {
      console.log(`parse assigned io error: ${e}`);
    }
  }

  if ("generateHwConfig" in args) {
    userAddressParams = JSON.parse(args["generateHwConfig"]);
    buildOptions = JSON.parse(args["buildOptions"]);
    dialog
      .showSaveDialog({
        title: "HWConfig Save Location",
        defaultPath: "hwconfig.cfg",
        properties: ["createDirectory", "showOverwriteConfirmation"],
      })
      .then((result) => {
        if (String(result.filePath).length > 0) {
          sortedRacks = buildHWConfig(
            String(result.filePath),
            hardwareRacks,
            hardwareInfo,
            userAddressParams,
            groupIOAddresses,
            buildSymbolTable,
            buildOptions
          );
        }
      })
      .catch((err) => {
        console.log(`generate hwconfig save error: ${err}`);
      });
  }

  if ("generateDriveConfig" in args) {
    try {
      const payload = JSON.parse(args["payload"]);
      buildOptions = JSON.parse(args["buildOptions"]);
      driveFilePath = payload["filePath"];
      columnNames = payload["columnNames"];
      typeIdentifier = payload["identifiers"];
      userAddressParams = payload["startAddress"];
      [drives, driveInfo] = parseDrives(
        driveFilePath,
        columnNames,
        typeIdentifier,
        userAddressParams
      );
      // console.log(`driveInfo: ${JSON.stringify(driveInfo)}`);
      event.sender.send("fromMain", { generateDriveConfig: driveInfo });
    } catch (e) {
      console.log(`generate drives config error: ${e}`);
    }

    dialog
      .showSaveDialog({
        title: "Drives Config Save Location",
        defaultPath: "drives_config.cfg",
        properties: ["createDirectory", "showOverwriteConfirmation"],
      })
      .then((result) => {
        if (String(result.filePath).length > 0) {
          sortedRacks = buildDrivesConfig(
            String(result.filePath),
            drives,
            buildSymbolTable,
            buildOptions
          );
        }
      })
      .catch((err) => {
        console.log(`generate drive save error: ${err}`);
      });
  }
});
