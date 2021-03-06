const { app, screen, BrowserWindow } = require('electron');
const ref = require('ref-napi');
const StructType = require('ref-struct-di')(ref);
const { HWND_BOTTOM, SWP_NOSIZE, SWP_NOMOVE, SWP_NOZORDER, SWP_SHOWWINDOW, SetWindowPos } = require('win-setwindowpos');

const WINDOWPOS = StructType({
	hwnd: ref.types.int32,
	hwndInsertAfter: ref.types.int32,
	x: ref.types.int32,
	y: ref.types.int32,
	cx: ref.types.int32,
	cy: ref.types.int32,
	flags: ref.types.uint32,
});

/** 
 * This message is sent to a window whose size,
 * position, or place in the Z order is about to change 
 * as a result of call to the `SetWindowPos` function.
 */
const WM_WINDOWPOSCHANGING = 0x0046;

/**
 * Positions and sticks the given window to the bottom of the z-index stack.
 * @param { BrowserWindow } window - the BrowserWindow object
 */
const stickToBottom = window => {
	if(app.isReady()) {
		try {
			const windowBounds = window.getBounds();
			const windowX = windowBounds.x;
			const windowY  = windowBounds.y;
			const whichScreen = screen.getDisplayNearestPoint({ x: windowX, y: windowY });
			const screenScaleFactor = whichScreen.scaleFactor;
			const windowWidth = windowBounds.width * screenScaleFactor;
			const windowHeight = windowBounds.height * screenScaleFactor;
			const windowHandle = window.getNativeWindowHandle();
			SetWindowPos(windowHandle, HWND_BOTTOM, windowX, windowY, windowWidth, windowHeight, SWP_SHOWWINDOW);
			// Prevent the change of the z-index of the window.
			window.hookWindowMessage(WM_WINDOWPOSCHANGING, (wParam, lParam) => {
				const buffer = Buffer.alloc(8);
				buffer.type = ref.refType(WINDOWPOS);
				lParam.copy(buffer);
				const actualStructDataBuffer = buffer.deref();
				const windowPos = actualStructDataBuffer.deref();
				const newFlags = windowPos.flags | SWP_NOZORDER | SWP_NOMOVE | SWP_NOSIZE;
				actualStructDataBuffer.writeUInt32LE(newFlags, 6);
				actualStructDataBuffer.writeUInt32LE(HWND_BOTTOM, 1);
			});
		} catch (error) {
			console.log('\x1b[31m');
			console.trace(error);
			console.log('\x1b[0m');
		}
	}
	else {
		console.log('\x1b[31m');
		console.trace('ERROR: stickToBottom() should be called after your electron app is ready.');
		console.log('\x1b[0m');
	}
}

module.exports = {
    stickToBottom
};
