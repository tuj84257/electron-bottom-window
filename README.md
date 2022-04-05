# electron-bottom-window

<img src="https://img.shields.io/npm/dt/electron-bottom-window?color=orange&logo=npm&style=for-the-badge">    <img src="https://img.shields.io/npm/l/electron-bottom-window?style=for-the-badge">

An Electron module that allows you to stick the browser window to the bottom of the z-index stack.

## Installation

```javascript
npm install electron-bottom-window
```

## Usage

```javascript
const { app, BrowserWindow } = require('electron')
const { stickToBottom } = require('electron-bottom-window');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        ...
    });
    mainWindow.loadFile('index.html');

    // Stick window to bottom
    stickToBottom(mainWindow);
}

app.whenReady().then(() => {
	createWindow(); 
});
```

----

:point_right: This module is based on this <a href="https://gist.github.com/lowfront/528a658d25e4357c07c8ea4f1b2cb46c">gist</a> :point_left: