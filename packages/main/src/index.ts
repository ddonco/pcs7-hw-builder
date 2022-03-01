import { app, ipcMain, webContents } from "electron";
import "./security-restrictions";
import { restoreOrCreateWindow } from "/@/mainWindow";
import { parseAssignedIO, parseColumnNames, parseRawIO } from "./utils/parser";
import { buildHW } from "./utils/builder";

let hardwareRacks: { [rack: string]: { [slot: string]: any } } = {};
let sortedRacks: { [rack: string]: { [slot: string]: any } } = {};
let hardwareInfo: { [type: string]: number } = {};
let ioFilePath: string = "";
let parsedColumnNames: string[] = [];
let ioColumnNames: { [col: string]: string } = {};
let args: { [prop: string]: any } = {};
let groupIOAddresses = true;
let userAddressParams = {
  diStart: 0,
  doStart: 0,
  aiStart: 512,
  aoStart: 512,
};

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

app.on("web-contents-created", (event, webContents) => {
  ipcMain.on("toMain", (event, args) => {
    webContents.on("did-finish-load", () => {
      console.log(args);
      webContents.send("fromMain", "for the love of god");
    });
  });

  ipcMain.on("toMain", (event, args) => {
    console.log(args);

    let ioTypeIdentifier = {
      di: ["DI Dry Contact"],
      do: ["DO High Side"],
      ai: ["AI2", "AI4"],
      ao: ["AO"],
    };
    ioColumnNames = {
      tagName: "TagID",
      description: "Service",
      rack: "Rack",
      slot: "PCS7 Slot",
      channel: "Chn",
      ioType: "I/O Type",
    };

    if ("assignedIoFilePath" in args) {
      ioFilePath = args["assignedIoFilePath"];
      parsedColumnNames = parseColumnNames(ioFilePath);
      console.log(`Column Names: ${parseColumnNames}`);
    }

    if ("parseIoFilePath" in args) {
      [hardwareRacks, hardwareInfo] = parseAssignedIO(
        ioFilePath,
        ioColumnNames,
        ioTypeIdentifier,
        true
      );
    }
    // const ioFilePath = "e:/dev/electron/GPCC_IOList.xlsx";
    // const filePath = "e:/dev/electron/Sample_IO_List-Unassigned.xlsx";
    const outFilePath = "e:/dev/electron/GPCC_HWConfig.cfg";

    if (args === "parse IO") {
      let ioColumnNames = {
        tagName: "TagID",
        description: "Service",
        rack: "Rack",
        slot: "PCS7 Slot",
        channel: "Chn",
        ioType: "I/O Type",
      };
      let ioTypeIdentifier = {
        di: ["DI Dry Contact"],
        do: ["DO High Side"],
        ai: ["AI2", "AI4"],
        ao: ["AO"],
      };

      let groupIOAddresses = true;
      let userAddressParams = {
        diStart: 0,
        doStart: 0,
        aiStart: 512,
        aoStart: 512,
      };

      if (groupIOAddresses) {
        userAddressParams = {
          diStart: 0,
          doStart: 132,
          aiStart: 512,
          aoStart: 1022,
        };
      }

      // webContents.send("fromMain", "parse started");

      // let hardwareInfo = {};
      // [hardwareRacks, hardwareInfo] = parseAssignedIO(
      //   ioFilePath,
      //   ioColumnNames,
      //   ioTypeIdentifier,
      //   true
      // );
      // // hardwareRacks = parseRawIO(filePath, true);

      // if (Object.keys(hardwareInfo).length > 0) console.log(hardwareInfo);

      // webContents.send("fromMain", "parse complete");

      // sortedRacks = buildHW(
      //   outFilePath,
      //   hardwareRacks,
      //   hardwareInfo,
      //   userAddressParams,
      //   groupIOAddresses
      // );
    }
  });
});
