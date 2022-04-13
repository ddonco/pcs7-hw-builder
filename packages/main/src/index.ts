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
import { parseAssignedIO, parseHeaders, parseRawIO } from "./utils/parser";
import { buildHW } from "./utils/builder";
const fsExtra = require("fs-extra");

let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
let sortedRacks: { [rack: string]: { [slot: string]: any } } = {};
let hardwareInfo: { [type: string]: number } = {};
let ioFilePath: string = "";
let parsedHeaders: string[] = [];
let ioColumnNames: { [col: string]: string } = {};
let ioTypeIdentifier: { [ioType: string]: string[] } = {};
let args: { [prop: string]: any } = {};
let groupIOAddresses = true;
let userAddressParams = {
  diStart: 0,
  doStart: 0,
  aiStart: 512,
  aoStart: 512,
};

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
  if ("updateLogs" in args) {
    try {
      let fileContent = fsExtra.readFileSync(logFile, "utf8");
      let logsArr = fileContent.split(/\r?\n/);
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

  if ("parseAssignedIo" in args) {
    try {
      let payload = JSON.parse(args["payload"]);
      ioFilePath = payload["filePath"];
      ioColumnNames = payload["columnNames"];
      ioTypeIdentifier = payload["identifiers"];
      [hardwareRacks, hardwareInfo] = parseAssignedIO(
        ioFilePath,
        ioColumnNames,
        ioTypeIdentifier,
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
    console.log(`generate hw addresses: ${userAddressParams}`);
    dialog
      .showSaveDialog({
        title: "HWConfig Save Location",
        defaultPath: "hwconfig.cfg",
        properties: ["createDirectory", "showOverwriteConfirmation"],
      })
      .then((result) => {
        if (String(result.filePath).length > 0) {
          sortedRacks = buildHW(
            String(result.filePath),
            hardwareRacks,
            hardwareInfo,
            userAddressParams,
            groupIOAddresses
          );
        }
      })
      .catch((err) => {
        console.log(`generate hwconfig save error: ${err}`);
      });
  }
});
