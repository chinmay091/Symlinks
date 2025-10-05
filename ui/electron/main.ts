import { app, BrowserWindow, ipcMain, dialog } from 'electron'
// import { createRequire } from 'node:module'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'node:fs'
import { Rule } from '../src/types';

// const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))

process.env.APP_ROOT = path.join(__dirname, '..')
export const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']
export const RENDERER_DIST = path.join(process.env.APP_ROOT, 'dist')
process.env.VITE_PUBLIC = VITE_DEV_SERVER_URL ? path.join(process.env.APP_ROOT, 'public') : RENDERER_DIST

let win: BrowserWindow | null

function createWindow() {
  win = new BrowserWindow({
    width: 900,
    height: 670,
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      // --- THIS IS THE CRITICAL FIX ---
      // This enables the secure bridge between your UI and the backend.
      contextIsolation: true,
      // This is a security best practice.
      nodeIntegration: false,
      // This is the correct path from your project's template.
      preload: path.join(__dirname, 'preload.mjs'),
    },
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
    // Automatically open dev tools in development
    win.webContents.openDevTools()
  } else {
    win.loadFile(path.join(RENDERER_DIST, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.whenReady().then(() => {
  // Add this block to handle the 'get-rules' request
  ipcMain.handle('get-rules', () => {
    const rulesPath = path.join(__dirname, '..', '..', 'backend', 'rules.json')
    try {
      const data = fs.readFileSync(rulesPath, 'utf-8')
      return JSON.parse(data)
    } catch (error) {
      console.error('Failed to read rules.json in main process:', error)
      return []
    }
  })

  ipcMain.handle('save-rules', async (_, newRules: Rule[]) => {
    const rulesPath = path.join(__dirname, '..', '..', 'backend', 'rules.json');
    try {
      // We write the entire updated list of rules back to the file
      await fs.promises.writeFile(rulesPath, JSON.stringify(newRules, null, 2));
      return { success: true };
    } catch (error) {
      console.error('Failed to save rules.json:', error);
      return { success: false, error: (error as Error).message };
    }
  });

  ipcMain.handle('select-folder', async () => {
  console.log('--- "select-folder" HANDLER TRIGGERED ---');

  if (win) {
    // Log the state of the window object for debugging
    console.log('Window object exists.');
    console.log('Is window destroyed?', win.isDestroyed());
    console.log('Is window visible?', win.isVisible());

    const { canceled, filePaths } = await dialog.showOpenDialog(
      win,
      {
        title: 'Select a Folder',
        properties: ['openDirectory'],
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

  createWindow()
})