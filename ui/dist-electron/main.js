import { app, ipcMain, dialog, BrowserWindow } from "electron";
import { fileURLToPath } from "node:url";
import path from "node:path";
import fs from "node:fs";
const __dirname = path.dirname(fileURLToPath(import.meta.url));
process.env.APP_ROOT = path.join(__dirname, "..");
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
const RENDERER_DIST = path.join(process.env.APP_ROOT, "dist");
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, "public") : RENDERER_DIST;
let win;
function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 670,
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    webPreferences: {
      // --- THIS IS THE CRITICAL FIX ---
      // This enables the secure bridge between your UI and the backend.
      contextIsolation: true,
      // This is a security best practice.
      nodeIntegration: false,
      // This is the correct path from your project's template.
      preload: path.join(__dirname, "preload.mjs")
    }
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
}
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
    win = null;
  }
});
app.whenReady().then(() => {
  ipcMain.handle("get-rules", () => {
    const rulesPath = path.join(__dirname, "..", "..", "backend", "rules.json");
    try {
      const data = fs.readFileSync(rulesPath, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Failed to read rules.json in main process:", error);
      return [];
    }
  });
  ipcMain.handle("save-rules", async (_, newRules) => {
    const rulesPath = path.join(__dirname, "..", "..", "backend", "rules.json");
    try {
      await fs.promises.writeFile(rulesPath, JSON.stringify(newRules, null, 2));
      return { success: true };
    } catch (error) {
      console.error("Failed to save rules.json:", error);
      return { success: false, error: error.message };
    }
  });
  ipcMain.handle("select-folder", async () => {
    console.log('--- "select-folder" HANDLER TRIGGERED ---');
    if (win) {
      console.log("Window object exists.");
      console.log("Is window destroyed?", win.isDestroyed());
      console.log("Is window visible?", win.isVisible());
      const { canceled, filePaths } = await dialog.showOpenDialog(
        win,
        {
          title: "Select a Folder",
          properties: ["openDirectory"]
        }
      );
      if (!canceled && filePaths.length > 0) {
        return filePaths[0];
      }
    } else {
      console.error('--- ERROR: The main window object ("win") is null! ---');
    }
    return null;
  });
  createWindow();
});
export {
  RENDERER_DIST,
  VITE_DEV_SERVER_URL
};
