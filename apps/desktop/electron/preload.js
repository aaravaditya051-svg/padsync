// responsibility: Electron preload script — safely exposes APIs to renderer
const { contextBridge } = require('electron');

// Expose a minimal API surface to the renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
});
