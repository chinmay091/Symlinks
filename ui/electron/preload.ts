import { contextBridge, ipcRenderer } from 'electron'
import { Rule } from '../src/types'

// The API now sends a message to the main process and waits for a response
const api = {
  getRules: () => ipcRenderer.invoke('get-rules'),
  // Add this new function
  saveRules: (rules: Rule[]): Promise<{ success: boolean; error?: string }> =>
    ipcRenderer.invoke('save-rules', rules),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
}

contextBridge.exposeInMainWorld('api', api)