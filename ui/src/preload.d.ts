import { Rule } from './types'

export interface IElectronAPI {
  // The function now returns a Promise
  getRules: () => Promise<Rule[]>;
  saveRules: (rules: Rule[]) => Promise<{ success: boolean; error?: string }>;
  selectFolder: () => Promise<string | null>;
}

declare global {
  interface Window {
    api: IElectronAPI;
  }
}