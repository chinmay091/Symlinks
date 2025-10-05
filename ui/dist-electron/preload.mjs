"use strict";
const electron = require("electron");
const api = {
  getRules: () => electron.ipcRenderer.invoke("get-rules"),
  // Add this new function
  saveRules: (rules) => electron.ipcRenderer.invoke("save-rules", rules),
  selectFolder: () => electron.ipcRenderer.invoke("select-folder")
};
electron.contextBridge.exposeInMainWorld("api", api);
