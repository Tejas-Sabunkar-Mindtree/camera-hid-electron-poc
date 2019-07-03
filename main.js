const electron = require('electron');
var usb = require('usb');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');

var HID = require('node-hid');
var devices = HID.devices();

console.log(devices);

let win;

console.log(usb.getDeviceList());

console.log('From the [Main.JS] file...');
createWindow = () => {
	win = new BrowserWindow({ show: false });
	win.loadURL(
		url.format({
			pathname: path.join(__dirname, 'index.html'),
			protocol: 'file',
			slashes: true
		})
	);

	win.once('ready-to-show', () => {
		win.show();
	});

	win.on('closed', () => {
		win = null;
	});
};

app.on('ready', createWindow);
app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});

app.on('activate', () => {
	if (win === null) {
		createWindow();
	}
});


